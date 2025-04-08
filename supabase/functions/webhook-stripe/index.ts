
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// To use this webhook, set up a Stripe webhook endpoint pointing to:
// https://[PROJECT_REF].functions.supabase.co/webhook-stripe
// Add a webhook secret in Supabase secrets
// Set up required events: payment_intent.succeeded

serve(async (req) => {
  // Get the Stripe signature from the headers
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'No signature provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Parse request body
    const body = await req.text();
    
    // Verify webhook signature
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Handle specific event types
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount / 100; // Convert from cents to euro
      
      if (userId) {
        // Call the deposit_funds function using the service role
        const { error } = await supabaseClient.rpc('deposit_funds', {
          p_user_id: userId,
          p_amount: amount
        });
        
        if (error) {
          console.error('Error depositing funds:', error);
          return new Response(JSON.stringify({ error: 'Failed to process payment' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Log the transaction
        await supabaseClient
          .from('wallet_transactions')
          .insert({
            user_id: userId,
            amount: amount,
            type: 'deposit',
            description: 'Stripe payment',
          });
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
