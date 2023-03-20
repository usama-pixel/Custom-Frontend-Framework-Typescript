import { HasId, Model } from "../models/Model"

export abstract class View<T extends Model<K>, K extends HasId> { // because Model is also generic, we need to pass a type to that as well,
  // now how do we do that? we do that by accepting a 2nd type named "K" inside this current class ("view"), and then pass that K to the Model
  // class. The "K" type is then essentially copy pasted to Model class.
  regions: {[key: string]: Element} = {}
  constructor(
    public parent: Element,
    public model: T,
    ) {
      this.bindModel()
    }
  
  abstract template(): string;
  
  regionsMap(): {[key: string]: string} {
    return {}
  }

  eventsMap(): {[key: string]: () => void} {
    return {}
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render()
    })
  }
  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap()
    for(let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':')

      fragment.querySelectorAll(selector).forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey])
      })
    }
  }

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap()
    for(let key in regionsMap) {
      const selector = regionsMap[key]
      const element = fragment.querySelector(selector)
      if(element) {
        this.regions[key] = element
      }
    }
  }

  // used for nesting the html, if any class needs to nest elements, they have to override this method
  onRender(): void {

  }
  
  render(): void {
    this.parent.innerHTML = ''
    
    const templateElement = document.createElement('template')
    templateElement.innerHTML = this.template()
    
    this.bindEvents(templateElement.content)
    this.mapRegions(templateElement.content)

    this.onRender()
    
    this.parent.appendChild(templateElement.content)
  }
}