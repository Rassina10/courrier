import { apiFetch } from "../../../lib/api"
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

export function Registercomponent({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const [name, setName] = useState ("")
    const [email, setEmail] = useState ("")
    const [password, setPassword] = useState ("")
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      apiFetch<{ access_token: string }>("/register", {
        method: "POST",
        data: { name, email, password },
      })
        .then((data) => {
          localStorage.setItem("token", data.access_token);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Erreur d'enregistrement :", err.message);
        });

      }
    function gotoLogin() {
      navigate("/login");
    }

  return (

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Inscrivez-vous à votre compte</CardTitle>
        
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Ada Salif"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
        <CardDescription>
           Entrez votre email ci-dessous pour vous inscrire à votre compte
        </CardDescription>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Enregistrer
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous avez déja un compte .{" "}
              <button onClick={gotoLogin} className="underline underline-offset-4">
                Se connecter
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

