
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CircleDollarSign, 
  Users, 
  Wallet, 
  ShieldCheck, 
  BarChart, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-kolo-purple">
          Welcome to KoloCollect
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern platform for community savings circles and cooperative financial groups
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/communities">
            <Button size="lg" className="gap-2">
              <CircleDollarSign className="h-5 w-5" />
              Explore Circles
            </Button>
          </Link>
          <Link to="/communities/new">
            <Button size="lg" variant="outline" className="gap-2">
              Start Your Circle
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">How KoloCollect Works</h2>
          <p className="text-gray-600 mt-2">Simple steps to financial cooperation and growth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-kolo-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-kolo-purple" />
                Create a Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Start a savings circle with your community, friends, or family. Set contribution amounts, frequency, and goals.</p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-kolo-teal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-kolo-teal" />
                Invite Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Add trusted members to your circle. Everyone contributes regularly according to the circle's schedule.</p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-kolo-light-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-kolo-light-purple" />
                Collect & Distribute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Funds are collected and distributed to members based on the circle's rules and rotation schedule.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Platform Features</h2>
          <p className="text-gray-600 mt-2">Everything you need to manage your savings circles</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-kolo-purple" />
                Secure Transactions
              </CardTitle>
              <CardDescription>Built with trust and security in mind</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All financial transactions are secured and transparent. Track every contribution and distribution with detailed records.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-kolo-purple" />
                Progress Tracking
              </CardTitle>
              <CardDescription>Visual insights into your circle's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Monitor your circle's progress with intuitive dashboards and reports. Set savings goals and track achievements.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-kolo-purple" />
                Community Management
              </CardTitle>
              <CardDescription>Tools to manage your circle members</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, remove, and communicate with circle members easily. Set roles and permissions for better organization.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-kolo-purple" />
                Flexible Payments
              </CardTitle>
              <CardDescription>Multiple ways to contribute</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Support for various payment methods and contribution schedules to accommodate all members' preferences.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-kolo-purple text-white p-8 rounded-lg text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to start your savings journey?</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Join thousands of people using KoloCollect to achieve their financial goals through community cooperation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/communities/new">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-kolo-purple hover:bg-gray-100">
              Create Your Circle Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
