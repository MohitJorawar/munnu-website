import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useStore } from "@/context/StoreContext";

const Profile = () => {
  const { user, logout, orders, fetchOrders } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [user, navigate, fetchOrders]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* User Info */}
          <div className="md:col-span-1">
            <Card className="shadow-lg border-primary/10 sticky top-24">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-display">{user.name}</CardTitle>
                <CardDescription>Member since March 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-lg bg-background/50">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-foreground text-sm truncate">{user.email}</span>
                </div>
                <Button variant="outline" className="w-full gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-bold">Order History</h2>
            {orders.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/20" />
                </div>
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                <Link to="/"><Button variant="outline">Start Shopping</Button></Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</p>
                          <p className="text-sm font-mono">#{order.id.toString().padStart(6, '0')}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
                          <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground truncate flex-1">
                              {item.name} <span className="text-xs">×{item.quantity}</span>
                            </span>
                            <span className="font-medium ml-4">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="py-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          order.status === 'pending' ? "bg-orange-100 text-orange-700" :
                          order.status === 'completed' ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-bold">₹{Number(order.total).toLocaleString()}</p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
