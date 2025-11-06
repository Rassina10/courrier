import { cn } from "../../../lib/utils"
import { Button } from "../button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card"
import { Input } from "../input"
import { Label } from "../label"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../../lib/api"
export function Logincomponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
apiFetch<{ access_token: string }>("/login", {
  method: "POST",
  data: { email, password },
})
  .then((data) => {
    localStorage.setItem("token", data.access_token);
    navigate("/dashboard");
  })
  .catch((err) => {
    console.error("Erreur de login :", err.message);
  });
  const token = localStorage.getItem("token");
  console.log("Token:", token);
}
  function  gotoRegister() {
    navigate("/register");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Connectez-vous à votre compte</CardTitle>
          <CardDescription>
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Connectez-vous avec Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Avez vous{" "}
              <button onClick={gotoRegister} className="underline underline-offset-4">
              S'inscrire

              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
