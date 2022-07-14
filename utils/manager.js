export class BaseManager{
  constructor(interactor){
    this._interactor = interactor
    this._interaction = interactor._interaction
  }
}