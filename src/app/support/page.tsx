
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LifeBuoy, Mail, Search, MessageSquare } from "lucide-react";

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click on the 'Forgot Password' link. You will receive an email with instructions on how to reset your password."
    },
    {
        question: "How do I add a new integration?",
        answer: "You can add a new integration from the 'Settings > Integrations' page. Click on the 'Add Integration' button and follow the on-screen instructions."
    },
    {
        question: "Where can I find my API keys?",
        answer: "Your API keys are located in the 'Settings > API' section. Please handle them securely and do not share them publicly."
    },
    {
        question: "How do I view the audit log?",
        answer: "The audit log is available on the 'Audit Log' page, accessible from the main navigation. You can filter and search for specific events."
    }
];

const contactOptions = [
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Chat with a support agent now.",
        cta: "Start Chat"
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "Get a response within 24 hours.",
        cta: "Send Email"
    }
];

export default function SupportPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold font-headline">Support Center</h1>
                <p className="mt-2 text-lg text-muted-foreground">How can we help you today?</p>
            </div>

            <div className="relative w-full max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search the knowledge base..." className="pl-10 h-12 rounded-xl text-base" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8">
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-4 space-y-6">
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                            <CardDescription>Can't find an answer?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {contactOptions.map((option, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                    <option.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">{option.title}</h3>
                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                        <Button variant="link" className="p-0 h-auto mt-1">{option.cta}</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    