"use client"

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context";
import { mockUsers } from "@/data";
import { EUserRole } from "@/enum";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function SigninForm() {
   const router = useRouter();
    const { user, setUser, logout} = useAuth();
  
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
  
    useEffect(() => {
      const validUser = mockUsers.find(dbUser => dbUser.username === user?.username && dbUser.password === user.password && dbUser.role === user.role);
      if(validUser){
        if(validUser.role === EUserRole.Admin){
          router.push('/questions');
        }else{
          router.push('/answers');
        }
      }else{
        logout();
      }
    }, []);
  
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
  
      const validUser = mockUsers.find(user => user.username === username && user.password === password);
      if(validUser){
        setUser(validUser);
        localStorage.setItem('user', JSON.stringify(validUser));
      }else{
        setError(true);
        return;
      }
  
      if(validUser?.role === EUserRole.Admin){
        router.push('/questions');
      }else{
        router.push('/answers');
      }
    };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                {error && <p className="text-red-500">Invalid username or password</p>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input 
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
