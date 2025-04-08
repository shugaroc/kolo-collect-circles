
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51LifdZ5vtFvW0ZfV0QNhLUCwepk2iZLwwBaZpksFzChBZNMf5Q6le7ZC');

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm = ({ amount, onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet?payment_success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage("Payment successful!");
        onSuccess();
      } else {
        setMessage("Payment is processing.");
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className={`p-3 rounded-md ${message.includes("successful") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-between gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !stripe}
          className="flex-1"
        >
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Pay €${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePayment = ({ amount, onSuccess, onCancel }: StripePaymentProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount },
        });
        
        if (error) {
          console.error('Error creating payment intent:', error);
          setError('Failed to initialize payment. Please try again.');
          return;
        }
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment setup error:', err);
        setError('Failed to set up payment. Please try again later.');
      }
    };
    
    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount]);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            {error}
          </div>
          <Button className="mt-4 w-full" onClick={onCancel}>
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-kolo-purple" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Securely deposit €{amount.toFixed(2)} to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </CardContent>
    </Card>
  );
};

export default StripePayment;
