"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Aperture } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    eyebrow: "WELCOME TO STUDIOSPACE",
    title: "Where creative",
    highlight: "ideas come alive.",
    description:
      "Discover extraordinary spaces for photography, filmmaking, podcasting, and everything your imagination can create.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=85",
    primaryText: "Explore Studios",
    primaryLink: "/studios",
    secondaryText: "Host Your Space",
    secondaryLink: "/add-studio",
  },
  {
    id: 2,
    eyebrow: "SPACES BUILT FOR CREATORS",
    title: "Your vision.",
    highlight: "Our spaces.",
    description:
      "From professional production sets to beautifully designed studios, find the perfect environment for your next project.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85",
    primaryText: "Find Your Studio",
    primaryLink: "/studios",
    secondaryText: "List Your Studio",
    secondaryLink: "/add-studio",
  },
  {
    id: 3,
    eyebrow: "CREATE WITHOUT LIMITS",
    title: "Make something",
    highlight: "extraordinary.",
    description:
      "Connect with inspiring creative spaces, book your ideal setup, and turn your next big idea into reality.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=85",
    primaryText: "Discover Spaces",
    primaryLink: "/studios",
    secondaryText: "Become a Host",
    secondaryLink: "/add-studio",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        slidesPerView={1}
        loop={true}
        effect="fade"
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        className="studiospace-hero"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex min-h-[620px] items-center overflow-hidden bg-[#24231f] sm:min-h-[680px] lg:min-h-[740px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${slide.image}")`,
                }}
              />

              <div className="absolute inset-0 bg-black/65" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

              <div className="container-shell relative z-10 py-24 text-white">
                <div className="max-w-3xl">
                  <div className="mb-7 flex items-center gap-3">
                    <Aperture
                      size={19}
                      className="text-[#f08a50]"
                    />

                    <span className="text-[11px] font-bold tracking-[0.22em] text-[#f5c4a8] sm:text-xs">
                      {slide.eyebrow}
                    </span>
                  </div>

                  <h1 className="text-[clamp(2.8rem,7vw,6rem)] leading-[1.07] font-bold tracking-[-0.065em]">
                    {slide.title}
                    <br />
                    <span className="text-[#f08a50]">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-white/75 sm:text-lg sm:leading-8">
                    {slide.description}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.primaryLink}
                      className="button-primary"
                    >
                      {slide.primaryText}
                      <ArrowRight size={18} />
                    </Link>

                    <Link
                      href={slide.secondaryLink}
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#24231f]"
                    >
                      {slide.secondaryText}
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 bottom-9 z-10 hidden text-xs tracking-[0.2em] text-white/60 sm:block lg:right-14">
                MADE FOR CREATORS
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}