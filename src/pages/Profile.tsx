
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phoneNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phoneNumber: "",
    },
  });
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get profile data directly using a custom query
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userError) {
          console.error("Error loading profile:", userError);
          
          if (userError.code !== 'PGRST116') {
            toast.error("Failed to load profile data");
          }
          
          // Use fallback data from user auth
          form.reset({
            fullName: user.user_metadata?.full_name || "",
            email: user.email || "",
            phoneNumber: "",
          });
          return;
        }
        
        if (userData) {
          form.reset({
            fullName: userData.full_name || "",
            email: user.email || "",
            phoneNumber: userData.phone_number || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user, form]);
  
  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Check if profile exists using a custom query
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingProfile) {
        // Update existing profile using RPC or direct update
        const { error } = await supabase.rpc('update_user_profile', {
          p_user_id: user.id,
          p_full_name: values.fullName,
          p_phone_number: values.phoneNumber
        }).maybeSingle();
        
        if (error) {
          // Fallback to direct update if RPC fails
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: values.fullName,
              phone_number: values.phoneNumber,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
            
          if (updateError) throw updateError;
        }
      } else {
        // Create new profile using direct insert
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: values.fullName,
            phone_number: values.phoneNumber,
          });
          
        if (error) throw error;
      }
      
      // Update user metadata
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: { full_name: values.fullName }
      });
      
      if (userUpdateError) throw userUpdateError;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-kolo-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your public avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "User"} />
              <AvatarFallback className="text-3xl">
                {form.getValues().fullName
                  ? form.getValues().fullName.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <Button variant="outline">
              Upload Picture
            </Button>
            <p className="text-xs text-gray-500">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
