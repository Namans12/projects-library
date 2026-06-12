import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

/**
 * The effect is pure CSS scroll-driven animation; the settings are baked in as
 * defaults on the <html> element (see index.html). GSAP ScrollTrigger is used
 * only as a fallback for browsers that lack scroll-driven animation support.
 */
export function usePlaybook() {
  useEffect(() => {
    const hasScrollSupport = CSS.supports(
      '(animation-timeline: view()) and (animation-range: 0 100%)'
    )
    if (hasScrollSupport) return

    gsap.registerPlugin(ScrollTrigger)
    console.info('GSAP ScrollTrigger registered')

    const scalerTl = gsap
      .timeline({
        scrollTrigger: {
          trigger: 'main section:first-of-type',
          start: 'top -10%',
          end: 'bottom 80%',
          scrub: true,
        },
      })
      .from(
        '.scaler img',
        { height: window.innerHeight - 32, ease: 'power1.inOut' },
        0
      )
      .from(
        '.scaler img',
        { width: window.innerWidth - 32, ease: 'power2.inOut' },
        0
      )

    const layersTl = gsap
      .timeline({
        scrollTrigger: {
          trigger: 'main section:first-of-type',
          start: 'top -40%',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      .from('.layer:nth-of-type(1)', { opacity: 0, ease: 'sine.out' }, 0)
      .from('.layer:nth-of-type(1)', { scale: 0, ease: 'power1.inOut' }, 0)
      .from('.layer:nth-of-type(2)', { opacity: 0, ease: 'sine.out' }, 0)
      .from('.layer:nth-of-type(2)', { scale: 0, ease: 'power3.inOut' }, 0)
      .from('.layer:nth-of-type(3)', { opacity: 0, ease: 'sine.out' }, 0)
      .from('.layer:nth-of-type(3)', { scale: 0, ease: 'power4.inOut' }, 0)

    return () => {
      scalerTl.kill()
      layersTl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])
}
