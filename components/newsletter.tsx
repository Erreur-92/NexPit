"use client";

import { useRef } from "react";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { FormNewsletter } from "./form-newsletter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { inputVariants } from "./ui/input";

const DURATION = 0.3;
const DELAY = DURATION;
const EASE_OUT = "easeOut";
const EASE_OUT_OPACITY = [0.25, 0.46, 0.45, 0.94] as const;

export const Newsletter = () => {
  const isInitialRender = useRef(true);

  return (
    <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
      <motion.div
        layout="position"
        transition={{ duration: DURATION, ease: EASE_OUT }}
      >
        <Image
          src="/NexPit_txt.svg"
          alt="NexPit"
          width={400}
          height={100}
          priority
          className="w-64 sm:w-96 lg:w-[32rem] h-auto"
        />
      </motion.div>

      <div className="flex flex-col items-center min-h-0 shrink w-full">
        <AnimatePresence mode="popLayout" propagate>
          <motion.div
            key="newsletter"
            className="w-full max-w-3xl"
            initial={isInitialRender.current ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={{
              visible: {
                scale: 1,
                transition: {
                  delay: DELAY,
                  duration: DURATION,
                  ease: EASE_OUT,
                },
              },
              hidden: {
                scale: 0.9,
                transition: { duration: DURATION, ease: EASE_OUT },
              },
              exit: {
                y: -150,
                scale: 0.9,
                transition: { duration: DURATION, ease: EASE_OUT },
              },
            }}
          >
            <div className="flex flex-col gap-4 w-full md:gap-6 lg:gap-8">
              <FormNewsletter
                input={(props) => (
                  /* @ts-expect-error - Type mismatch */
                  <motion.input
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Entrez votre email"
                    className={inputVariants()}
                    initial={isInitialRender.current ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: DURATION,
                        ease: EASE_OUT_OPACITY,
                      },
                    }}
                    transition={{
                      duration: DURATION,
                      ease: EASE_OUT,
                      delay: DELAY,
                    }}
                    {...props}
                  />
                )}
                submit={(props) => (
                  /* @ts-expect-error - Type mismatch */
                  <motion.button
                    className={buttonVariants({
                      variant: "iconButton",
                      size: "icon-xl",
                    })}
                    {...props}
                    initial={isInitialRender.current ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: DURATION,
                        ease: EASE_OUT_OPACITY,
                      },
                    }}
                    transition={{
                      duration: DURATION,
                      ease: EASE_OUT,
                      delay: DELAY,
                    }}
                  >
                    <ArrowRightIcon className="w-4 h-4 text-current" />
                  </motion.button>
                )}
              />
              <motion.p
                initial={isInitialRender.current ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: DURATION, ease: EASE_OUT_OPACITY },
                }}
                transition={{
                  duration: DURATION,
                  ease: EASE_OUT,
                  delay: DELAY,
                }}
                className="text-sm sm:text-base text-center text-foreground"
              >
                Nous arrivons bientôt ! Inscrivez-vous pour recevoir les dernières
                mises à jour.
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
