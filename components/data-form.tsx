"use client"

import { useSafeFormData } from "@/lib/hooks/useSaveData"
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
  age: z
    .number()
    .min(18, { message: "at least 18 years old" })
    .max(100, { message: "at most 100 years old" })
})

type FormSchema = z.infer<typeof formSchema>

// Storage keys configuration
const FORM_STORAGE_KEYS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phone: "phone",
  address: "address",
  gender: "gender",
  age: "age"
}

// Create empty form state
const createEmptyFormState = (): FormSchema => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  gender: "male",
  age: 18
})

export function DataForm() {
  const [data, setData] = useState<FormSchema>(createEmptyFormState())
  const formStorage = useSafeFormData<FormSchema>({
    keys: FORM_STORAGE_KEYS,
    area: "local",
    defaultValues: null
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: createEmptyFormState()
  })

  async function onSubmit(values: FormSchema) {
    setData(values)

    // Save all form values to storage
    await formStorage.saveAll(values)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 flex flex-col">
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
              <FormItem className="">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormDescription>{data.lastName}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Must greater than 18"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>{data.age}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input placeholder="Male/Female/Other" {...field} />
                </FormControl>
                <FormDescription>{data.gender}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormDescription>{data.email}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormDescription>{data.phone}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Anytown, USA" {...field} />
                </FormControl>
                <FormDescription>{data.address}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>{JSON.stringify(formStorage.state)}</div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
