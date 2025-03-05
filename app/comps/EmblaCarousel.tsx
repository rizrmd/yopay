import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import useEmblaCarousel from "embla-carousel-react";
import { ImgThumb } from "app/lib/ui/img-thumb";

type PropType = {
  slides: { img: string; link: string }[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section
      className={cx(
        "embla",
        css`
          max-width: 48rem;
          margin: auto;
          --slide-spacing: 1rem;
          --slide-size: 100%;
          .embla__viewport {
            overflow: hidden;
          }
          .embla__container {
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
          }
          .embla__slide {
            transform: translate3d(0, 0, 0);
            flex: 0 0 var(--slide-size);
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__slide__number {
            box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
            border-radius: 1.8rem;
            font-size: 4rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            height: var(--slide-height);
            user-select: none;
          }
          .embla__controls {
            display: grid;
            grid-template-columns: auto 1fr;
            justify-content: space-between;
            gap: 1.2rem;
            margin-top: 10px;
          }
          .embla__dots {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            padding-left: 10px;
            align-items: center;
            margin-right: calc((2.6rem - 1.4rem) / 2 * -1);
          }
          .embla__dot {
            -webkit-tap-highlight-color: rgba(
              var(--text-high-contrast-rgb-value),
              0.5
            );
            -webkit-appearance: none;
            appearance: none;
            background-color: transparent;
            touch-action: manipulation;
            display: inline-flex;
            text-decoration: none;
            cursor: pointer;
            border: 2px solid black;
            padding: 0;
            margin: 0;
            width: 15px;
            height: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin: 0px 5px;
          }
          .embla__dot:after {
            box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);

            width: 15px;
            height: 15px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            content: "";
          }
          .embla__dot--selected:after {
            box-shadow: inset 0 0 0 0.2rem var(--text-body);
            background: black;
          }
        `
      )}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item, idx) => (
            <div className="embla__slide" key={idx}>
              <div
                className={cx(
                  "embla__slide__number",
                  item.link && "cursor-pointer"
                )}
                onClick={() => {
                  if (item.link) {
                    if (item.link.startsWith("/")) {
                      navigate(item.link);
                    } else {
                      location.href = item.link;
                    }
                  }
                }}
              >
                <ImgThumb src={item.img} w={700} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="embla__controls">
          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EmblaCarousel;
