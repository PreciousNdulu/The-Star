import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, Award, Newspaper, ArrowRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import AnimatedCounter from "../components/AnimatedCounter";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { apiRequest } from "@/lib/queryClient";
import { ImpactStory } from "../types";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  story: z.string().min(10, { message: "Your story must be at least 10 characters" }),
});

type FormData = z.infer<typeof formSchema>;

// Statistics data
const impactStats = [
  { 
    icon: <Newspaper className="h-8 w-8 text-white" />,
    value: 83250,
    label: "Stories Published",
    suffix: "+",
    format: (val: number) => val.toLocaleString()
  },
  { 
    icon: <Users className="h-8 w-8 text-white" />,
    value: 2800000,
    label: "Monthly Readers",
    suffix: "+",
    format: (val: number) => (val / 1000000).toFixed(1) + 'M'
  },
  { 
    icon: <Award className="h-8 w-8 text-white" />,
    value: 45,
    label: "Journalism Awards",
    suffix: "+",
  },
  { 
    icon: <BookOpen className="h-8 w-8 text-white" />,
    value: 18,
    label: "Years of Journalism",
  },
];

const StatCard = ({ stat, index }: { stat: typeof impactStats[0], index: number }) => {
  return (
    <motion.div
      className="black-blue  p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="p-3 bg-[rgb(30,55,87)] w-fit rounded-lg mb-4">
        {stat.icon}
      </div>
      <div className="font-montserrat font-bold text-4xl md:text-5xl mb-1 text-white">
        <AnimatedCounter 
          value={stat.value} 
          suffix={stat.suffix || ""} 
          formatFn={stat.format || ((val: number) => val.toString())}
          duration={2.5}
        />
      </div>
      <div className="text-blue-200">{stat.label}</div>
    </motion.div>
  );
};

const Impact = () => {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });
  const { toast } = useToast();
  
  // For parallax effects
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Fetch a random testimonial
  const { data: testimonial } = useQuery<ImpactStory>({
    queryKey: ['/api/stories/featured'],
  });

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      story: "",
    },
  });

  // Handle story submission
  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/stories", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for sharing your story!",
        description: "Your experience with The Star has been recorded.",
      });
      
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "We couldn't submit your story. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <section 
      id="impact" 
      className="bg-black py-20 relative text-white overflow-hidden"
      ref={containerRef}
    >
      {/* Enhanced background decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right motion element */}
        <motion.div 
          className="absolute -top-5 -right-20 w-96 h-96 rounded-full bg-white opacity-5 "
          style={{ 
            y: yPos,
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]) 
          }}
        />
        
        {/* Bottom left motion element */}
        <motion.div 
          className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-white opacity-5"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [100, 0]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]) 
          }}
        />
        
        {/* Decorative floating elements inspired by BBC Storyworks */}
        <motion.div 
          className="absolute top-1/4 left-[15%] w-12 h-12 rounded-full opacity-10"
  style={{ 
    backgroundColor: "rgb(30, 55, 87)",
            y: useTransform(scrollYProgress, [0, 1], [-30, 30]),
            x: useTransform(scrollYProgress, [0, 1], [-10, 10]) 
          }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-[10%] w-20 h-20 rounded-full opacity-10"
  style={{ 

         backgroundColor: "rgb(30, 55, 87)", 
            y: useTransform(scrollYProgress, [0, 1], [40, -40]),
            x: useTransform(scrollYProgress, [0, 1], [20, -20]) 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/2 left-1/4 w-24 h-24 rounded-full opacity-5"
  style={{ 
            y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
            rotate: useTransform(scrollYProgress, [0, 1], [45, 90]) 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full opacity-5"
          style={{ 
          backgroundColor: "rgb(30, 55, 87)", 
            y: useTransform(scrollYProgress, [0, 1], [30, -30]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]) 
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading color="white">
            18 YEARS OF IMPACT          </SectionHeading>
          
          <motion.p 
            className="text-blue-100 text-lg mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            For 18 years, The Star has been a pillar of Kenyan journalism, bringing impactful stories
            to the public and driving meaningful conversations across the nation.
          </motion.p>
        </motion.div>
        
        {/* Impact Statistics with animated counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {impactStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start" ref={(el) => {
            // Create a div element ref
            if (el) ref(el);
          }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
  className="backdrop-blur-sm rounded-xl p-8 h-full relative overflow-hidden shadow-xl"
  style={{ background: "linear-gradient(45deg, #051523, #6d6d6d78)" }}
>
  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
  style={{ background: "linear-gradient(45deg, #051523, #6d6d6d78)" }} />

              <h3 className="font-montserrat font-bold text-2xl mb-6 text-white">SHARE YOUR STORY</h3>
              <p className="text-blue-100 mb-6">
                How has The Star's journalism impacted your life? Share your experience with us.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Your Name" 
                            {...field} 
                           className="border-gray-600 text-white placeholder:text-blue-300"
style={{ backgroundColor: "rgb(30, 55, 87)" }}
                              ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="story"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Your story and how The Star has impacted you..." 
                            className="min-h-[120px] border-blue-600 text-white placeholder:text-blue-300"
style={{ backgroundColor: "rgb(30, 55, 87)" }}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={submitMutation.isPending}
                    className="bg-white text-[hsl(var(--primary-blue))] hover:bg-blue-50 w-full flex items-center justify-center"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Your Story"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="bg-opacity-70 backdrop-blur-sm rounded-xl p-8 mb-6 shadow-xl"
            style={{ background: 'linear-gradient(45deg, #051523, #6d6d6d78)' }}>
              <h3 className="font-montserrat font-bold text-2xl mb-6 text-white">TESTIMONIALS</h3>
              
              {testimonial && (
                <motion.div 
                  className="relative py-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute top-0 left-0 text-blue-500 text-6xl opacity-20">❝</div>
                  <div className="relative z-10">
                    <p className="text-lg italic text-blue-100 mb-6 pl-4">
                      "{testimonial.story}"
                    </p>
                    <div className="flex items-center mt-4 pl-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-xl"
style={{ backgroundColor: "rgb(30, 55, 87)" }}>
                        
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white">{testimonial.name}</p>
                        <p className="text-blue-300 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 text-blue-500 text-6xl opacity-20">❞</div>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="backdrop-blur-sm rounded-xl p-8 shadow-xl relative overflow-hidden flex-1"
              style={{ background: "linear-gradient(45deg, #051523, #6d6d6d78)" }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
                 style={{
                  background: "linear-gradient(45deg, #051523, #6d6d6d78)"
           }}
/>

              <h3 className="font-montserrat font-bold text-2xl mb-4 text-white">OUR ARCHIVE</h3>
              <p className="text-blue-100 mb-6">
                Explore 18 years of impactful journalism through our digital archives. Browse historic headlines and significant stories.
              </p>
              
              <motion.a
                href="/archives"
                className="inline-flex items-center bg-white text-[hsl(var(--primary-blue))] font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse Archives
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Impact;