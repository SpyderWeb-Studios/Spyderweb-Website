# Interact Interface

The **Interact Interface** defines the contract that any actor or object must implement in order to be interactable by an `UInteractionComponentBase`.
It provides a single entry point — `Interact()` — which can be customized in both **Blueprint** and **C++**.

---

## Interface Overview

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Interaction")
void Interact(UInteractionComponentBase* Interactor);
```

### Parameters

| Name         | Type                         | Description                                                                                      |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `Interactor` | `UInteractionComponentBase*` | The interaction component initiating the interaction. Typically belongs to a player or AI actor. |

### Behavior

When an actor or object implements this interface, it can define how it reacts when interacted with.
For example — opening a door, picking up an item, triggering dialogue, or activating a mechanism.

---

## Implementation Example

### In C++

```cpp
void AMyDoorActor::Interact_Implementation(UInteractionComponentBase* Interactor)
{
	OpenDoor();
}
```

### In Blueprint

1. Add the **Interact Interface** to your Blueprint class.
2. Implement the **Interact (Event)** function.
3. Add your custom behavior, such as playing an animation, toggling a state, or destroying an actor.

---

## Interaction Flow

Here’s how the system ties together:

1. **Player calls** `InteractWithBest()` on their `UInteractionComponentBase`.
2. The component:

   * Validates authority.
   * Finds the closest valid interactable using `GetBestInteractable()`.
   * Calls `Interact()` on that object.
3. The target object (which implements `UInteractInterface`) executes its `Interact()` logic.

---

## Example Use Cases

* **Doors / Switches** — Open or toggle states when interacted with.
* **Items / Pickups** — Add themselves to the player’s inventory.
* **Dialogue / NPCs** — Start conversations or trigger UI prompts.
* **Machines / Consoles** — Activate gameplay logic or send events.

---

## Best Practices

---

Would you like me to generate a **diagram + quick setup section** showing how to wire this into your project (player + interactable + collider setup) — similar to your inventory plugin guide? It would make this a complete “Interaction System” documentation page.
