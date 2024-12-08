"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Leaf, Send } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

export default function FarmbotForm() {
  const [formData, setFormData] = useState({
    country: "",
    ph: "",
    moisture: "",
    light: "",
    temp: "",
  })

  const [question, setQuestion] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return

    setIsLoading(true)

    console.log("Message entered by the user: ", question);

    try {

      const response = await axios.post("https://farmbotai.vercel.app/api/prompt", {
        userMessage: question,
        context: formData,
      })

      if( response.status === 200 ){
        setAiResponse(response.data.message);
      }
      else{
        toast({
          title: "Could not get the response from the model at this time.",
        })
      }      

    } 
    catch (error) {
      toast({
        title: "Error while sending the request to the user at this time.",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 dark:from-green-900/10 dark:to-green-900/20">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">FarmbotAI</CardTitle>
          <CardDescription>
            Enter your farm's environmental data for personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="Enter your country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="ph">pH Level</Label>
              <Input
                id="ph"
                name="ph"
                placeholder="Enter soil pH level"
                value={formData.ph}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">Soil pH typically ranges from 0 to 14</p>
            </div>
            <div>
              <Label htmlFor="moisture">Moisture</Label>
              <Input
                id="moisture"
                name="moisture"
                placeholder="Enter soil moisture level"
                value={formData.moisture}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter moisture percentage</p>
            </div>
            <div>
              <Label htmlFor="light">Light</Label>
              <Input
                id="light"
                name="light"
                placeholder="Enter light intensity"
                value={formData.light}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">Light intensity in lux</p>
            </div>
            <div>
              <Label htmlFor="temp">Temperature</Label>
              <Input
                id="temp"
                name="temp"
                placeholder="Enter temperature"
                value={formData.temp}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">Temperature in celsius</p>
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask me anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleQuestionSubmit();
                  }
                }}
              />
              <Button 
                onClick={handleQuestionSubmit} 
                disabled={isLoading}
                className="px-3"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            {aiResponse && (
              <Textarea
                value={aiResponse}
                readOnly
                className="mt-4 h-32 resize-none"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}