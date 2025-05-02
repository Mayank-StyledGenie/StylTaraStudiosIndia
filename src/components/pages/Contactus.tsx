"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiMail, FiMapPin } from "react-icons/fi";
import Button from "../ui/Button";
import Container from "../ui/Container";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      toast.success("Message sent successfully!");
      reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container marginLeft="5vw" marginRight="5vw">
    <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center gap-8 md:gap-25">
      <div className="mb-8">
      <h2 className="text-2xl font-bold mb-10">Contact us</h2>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in touch today</h1>
      <p className="text-lg mb-1">We&apos;re here to help with any questions or inquiries.</p>
      <p className="text-lg mb-8">Reach out today and let&apos;s start something amazing!</p>

      <div className="flex items-center mb-4">
        <FiMail className="mr-2" />
        <a href="mailto:info@styltarastudios.com" className="hover:underline">
        info@styltarastudios.com
        </a>
      </div>

      <div className="flex items-start">
        <FiMapPin className="mr-2 mt-1" />
        <address className="not-italic">
        180, Shree Ram Vihar,<br />
        Mahal Yojna, Jagatpura,<br />
        Jaipur - 302033.
        </address>
      </div>
      </div>

      <div className="bg-[#D8D2C2] rounded-lg p-8 md:p-10 w-full md:w-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
          <strong>Full Name</strong>
        </label>
        <input
          type="text"
          id="fullName"
          className="w-full p-3 bg-white"
          placeholder="StylTara"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          <strong>Email</strong>
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-3 bg-white"
          placeholder="styltara@gmail.com"
          {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          <strong>Phone</strong>
        </label>
        <input
          type="tel"
          id="phone"
          className="w-full p-3 bg-white"
          placeholder="123456789"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
        <label htmlFor="city" className="block text-sm font-medium mb-2">
        <strong>City</strong>
        </label>
        <input
          type="text"
          id="city"
          className="w-full p-3 bg-white"
          placeholder="Jaipur"
          {...register("city", { required: "City is required" })}
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div className="md:col-span-2">
        <label htmlFor="message" className="block text-sm font-medium mb-2">
        <strong>Message</strong>
        </label>
        <textarea
          id="message"
          rows={6}
          className="w-full p-3 bg-white"
          placeholder="Please type your message here..."
          {...register("message", { required: "Message is required" })}
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4a1d3d] text-white py-3 px-6 rounded-md hover:bg-[#3a1730] transition-colors duration-300 disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
        </div>
      </form>
      </div>
    </div>
    </Container>
  );
};

export default ContactPage;