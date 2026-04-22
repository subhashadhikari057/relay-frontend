import { Marquee } from "@/components/shadcn-space/animations/marquee";

type LogoCloudProps = {
  brands?: BrandLogo[];
  title?: string;
};

type BrandLogo = {
  name: string;
};

const defaultBrands: BrandLogo[] = [
  { name: "Google" },
  { name: "Vercel" },
  { name: "Jenkins" },
  { name: "Docker" },
];

export default function MarqueeBrandsDemo({
  brands = defaultBrands,
  title = "Trusted by product teams at",
}: LogoCloudProps) {
  return (
    <section className="overflow-hidden border-b border-border py-12">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Marquee className="[--duration:22s] [--gap:2.5rem] p-0" repeat={2}>
            {brands.map((brand) => (
              <span
                key={brand.name}
                className="inline-flex min-h-[4.5rem] min-w-[11.5rem] items-center justify-center rounded-full px-6 py-3 sm:min-h-20 sm:min-w-[14rem]"
              >
                <span className="bg-[radial-gradient(circle_at_50%_50%,oklch(1_0_0_/_0.18),transparent_72%)] bg-clip-text text-[1.375rem] font-semibold tracking-tight text-foreground/60 sm:text-[1.6rem]">
                  {brand.name}
                </span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
