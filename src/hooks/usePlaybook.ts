import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

/**
 * The effect is pure CSS scroll-driven animation; the settings are baked in as
 * defaults on the <html> element (see index.html). The hero card scales down
 * from a large hero size into its grid cell as the section scrolls. GSAP
 * ScrollTrigger is used only as a fallback for browsers that lack scroll-driven
 * animation support.
 *
 * This hook also toggles data-settled on the sticky section once the hero
 * card has finished shrinking into its grid cell — the flip interaction is
 * gated on that attribute so the card can't flip mid-scroll.
 */
export function usePlaybook() {
  useEffect(() => {
    const section = document.querySelector('main section:first-of-type')
    const scaler = section?.querySelector<HTMLElement>('.scaler')
    if (!section || !scaler) return

    const updateHeroScale = () => {
      const { width, height } = scaler.getBoundingClientRect()
      if (!width || !height) return

      const styles = getComputedStyle(document.documentElement)
      const gutter = Number.parseFloat(styles.getPropertyValue('--gutter')) || 32
      const availableWidth = Math.max(1, window.innerWidth - gutter * 2)
      const availableHeight = Math.max(1, window.innerHeight - gutter * 2)
      const startScale = Math.max(
        1,
        Math.min(availableWidth / width, availableHeight / height)
      )

      scaler.style.setProperty('--hero-start-scale', String(startScale))
    }

    const hasScrollSupport = CSS.supports(
      '(animation-timeline: view()) and (animation-range: 0 100%)'
    )

    // The CSS animation-range ends at `exit -20%`, i.e. when the section's
    // bottom edge sits 20% of the viewport below the fold. The GSAP fallback
    // timeline ends at 'bottom 80%' instead, so settle later there.
    const settleAt = hasScrollSupport ? 1.2 : 0.8
    const onScroll = () => {
      const settled =
        section.getBoundingClientRect().bottom <=
        window.innerHeight * settleAt + 1
      section.toggleAttribute('data-settled', settled)
    }
    updateHeroScale()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateHeroScale)
    window.addEventListener('resize', onScroll)

    let cleanupGsap: (() => void) | undefined

    if (!hasScrollSupport) {
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
          '.scaler .flip',
          {
            scale: () =>
              Number.parseFloat(
                getComputedStyle(scaler).getPropertyValue('--hero-start-scale')
              ) || 1,
            ease: 'power2.inOut',
          },
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

      cleanupGsap = () => {
        scalerTl.kill()
        layersTl.kill()
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateHeroScale)
      window.removeEventListener('resize', onScroll)
      cleanupGsap?.()
    }
  }, [])
}
