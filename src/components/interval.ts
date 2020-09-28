
// a thing to trigger callback on animationFrame after a specified amount of time has passed
export class Intervaller {
  constructor (
    public interval: number,
    private lastUpdate = 0,
    private handle = 0,
    private listeners: (()=> void)[] = []
  ) {}

  private update = () => {
    const now = Date.now()
    if (now - this.lastUpdate >= this.interval) {
      this.lastUpdate = now
      this.trigger()
    }
    this.handle = window.requestAnimationFrame(this.update)
  }

  public setInterval = (interval: number) => {
    this.interval = interval
    return this
  }

  public addListener = (x: () => void) => {
    this.listeners.push(x)
    return this
  }

  public start = () => {
    this.update()
    return this
  }

  public stop = () => {
    window.cancelAnimationFrame(this.handle)
    return this
  }

  private trigger = () =>
    this.listeners.forEach(x => x())
}