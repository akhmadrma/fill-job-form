"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form"
import { Input } from "./ui/input"

export interface DataFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  defaultValues: z.infer<typeof formSchema>
  placeholder: z.infer<typeof formSchema>
}

const formSchema = z.object({
  firstName: z.string().min(2, { message: "at least 2 characters" }).max(50),
  lastName: z.string().min(2, { message: "at least 2 characters" }).max(50),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(10, { message: "at least 10 characters" }).max(15),
  address: z.string().min(10, { message: "at least 10 characters" }).max(150),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(18, { message: "at least 18 years" }).max(120, { message: "at most 120 years" }),
})
export function DataForm() {
  const [data, setData] = useState<z.infer<typeof formSchema>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    age: 18,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setData(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>{data.firstName}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>{data.lastName}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
