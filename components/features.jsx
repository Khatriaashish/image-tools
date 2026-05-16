import { Crop, Expand, ImageOff, Maximize2, Sliders, Type } from "lucide-react";

const features = [
  {
    icon: Crop,
    title: "Crop",
    description: "Set ratios, frame the image, and keep the canvas predictable.",
  },
  {
    icon: Expand,
    title: "Resize",
    description: "Change dimensions for web, social, and product images.",
  },
  {
    icon: Sliders,
    title: "Adjust",
    description: "Tune brightness, contrast, saturation, blur, and rotation.",
  },
  {
    icon: Type,
    title: "Text",
    description: "Add readable labels, captions, and simple overlays.",
  },
  {
    icon: ImageOff,
    title: "Background",
    description: "Remove image backgrounds when your plan includes AI tools.",
  },
  {
    icon: Maximize2,
    title: "Extend",
    description: "Expand the frame with AI fill for wider compositions.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-b border-[#DADDE3] py-16" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 border-b border-[#DADDE3] pb-10 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-medium text-[#002FA7]">Tools</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[#111827]">
              Everything visible. Nothing buried.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#4B5563]">
            ChitraMingle keeps the common image workflow close: upload, edit,
            save, export. AI tools stay clearly marked when a plan gate applies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="border-b border-[#DADDE3] p-6 md:border-r lg:min-h-56"
              >
                <p className="mb-8 text-4xl font-semibold tabular-nums text-[#A7AFBC]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Icon className="mb-4 h-5 w-5 text-[#002FA7]" />
                <h3 className="text-xl font-semibold text-[#111827]">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-[#4B5563]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
