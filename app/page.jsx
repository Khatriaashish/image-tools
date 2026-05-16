"use client";

import FeaturesSection from "@/components/features";
import PricingSection from "@/components/pricing";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImagePlus, SlidersHorizontal, Wand2 } from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Upload", detail: "Drop one image" },
  { label: "Edit", detail: "Crop, adjust, AI tools" },
  { label: "Export", detail: "PNG, JPEG, WebP" },
];

const toolPreview = [
  { icon: ImagePlus, label: "Upload" },
  { icon: SlidersHorizontal, label: "Adjust" },
  { icon: Wand2, label: "AI edit" },
];

function HeroSection() {
  return (
    <section className="border-b border-[#DADDE3] pt-24">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center border-[#DADDE3] px-4 py-14 sm:px-6 lg:border-r lg:py-20">
          <p className="mb-5 text-sm font-medium text-[#002FA7]">
            Fast image editing for everyday creative work
          </p>
          <h1 className="max-w-3xl text-6xl font-semibold leading-[0.95] tracking-tight text-[#111827] md:text-8xl">
            ChitraMingle
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#4B5563]">
            Clean tools for cropping, resizing, color edits, background removal,
            image extension, and export. Start with one upload and reach the
            editor in seconds.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button variant="primary" size="xl" className="w-full sm:w-auto">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="glass" size="xl" className="w-full sm:w-auto">
                View tools
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center px-4 py-10 sm:px-6 lg:py-20">
          <div className="w-full border border-[#DADDE3] bg-[#F7F7F8]">
            <div className="grid grid-cols-[120px_1fr] border-b border-[#DADDE3] text-sm">
              <div className="border-r border-[#DADDE3] p-4 font-medium text-[#002FA7]">
                01
              </div>
              <div className="p-4 text-[#4B5563]">New image</div>
            </div>
            <div className="grid grid-cols-3 border-b border-[#DADDE3]">
              {toolPreview.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.label}
                    className="border-r border-[#DADDE3] p-4 last:border-r-0"
                  >
                    <Icon className="mb-10 h-5 w-5 text-[#002FA7]" />
                    <p className="text-sm font-medium text-[#111827]">
                      {tool.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="p-4">
              <div className="aspect-[4/3] border border-[#DADDE3] bg-white p-4">
                <div className="flex h-full items-center justify-center border border-dashed border-[#A7AFBC] text-sm text-[#6B7280]">
                  Drop image here
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-[#DADDE3]">
              {steps.map((step, index) => (
                <div
                  key={step.label}
                  className="border-r border-[#DADDE3] p-4 last:border-r-0"
                >
                  <p className="mb-1 text-3xl font-semibold tabular-nums text-[#111827]">
                    0{index + 1}
                  </p>
                  <p className="text-sm font-medium text-[#111827]">
                    {step.label}
                  </p>
                  <p className="text-sm text-[#6B7280]">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <section className="border-t border-[#DADDE3] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-[#002FA7]">Ready</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[#111827]">
              Open a project and edit.
            </h2>
          </div>
          <Link href="/dashboard">
            <Button variant="primary" size="xl">
              Start now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
