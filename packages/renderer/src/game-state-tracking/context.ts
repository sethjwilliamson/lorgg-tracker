import { State } from "./state";

export class Context {
  private state!: State;

  constructor(state: State) {
    console.log(state);

    this.transitionTo(state);
  }

  public transitionTo(state: State): void {
    this.state?.beforeStateChange();

    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.state = state;

    this.state.setContext(this);

    this.state.afterStateChange();
  }

  public onCall(): void {
    console.log(this.state);
    this.state.handle();
    this.state.checkForStateChange();
  }
}
