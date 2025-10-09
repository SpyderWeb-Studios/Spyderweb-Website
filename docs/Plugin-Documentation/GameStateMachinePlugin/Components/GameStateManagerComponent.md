
# UGameStateManagerComponent Documentation

## Overview

`UGameStateManagerComponent` is a **manager component** that handles **state transitions** and **active state tracking** for actors in Unreal Engine.

It acts as a wrapper around a `URootStateObject` (master state) and exposes functionality to:

* Enter and exit states.
* Track the currently active state.
* Broadcast state transition events.
* Tick the master state to allow continuous updates.

It is **designed for complex state machines**, supporting nested states, tags, and general-purpose gameplay or simulation systems.

---

## Properties

| Name                     | Type                      | Description                                                                               |
| ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| `m_MasterStateObject`    | `URootStateObject*`       | The root/master state that this component manages. Must be assigned for proper operation. |
| `OnStateTransition`      | `FOnStateTransition`      | Broadcasts when a new state is activated. Provides the `NewState`.                        |
| `OnStateTransitionEvent` | `FOnStateTransitionEvent` | Detailed state transition event. Provides both old and new states and their classes.      |

---

## Functions

### `AttemptStateTransition`

Attempts to transition from the current state to a target `UStateObject`. Delegates the call to the master state object.

| Parameter     | Type            | Description                        |
| ------------- | --------------- | ---------------------------------- |
| `TargetState` | `UStateObject*` | The state object to transition to. |

**Returns:**
`bool` – `true` if the transition was successful, `false` otherwise.

**Example:**

```cpp
UGameStateManagerComponent* Manager = Actor->FindComponentByClass<UGameStateManagerComponent>();
if(Manager->AttemptStateTransition(MyTargetState))
{
    UE_LOG(LogTemp, Display, TEXT("State transition successful."));
}
```

**Behavior Summary:**

* Checks the validity and entry conditions of the target state.
* Exits the current active state if necessary.
* Marks the target state as active and broadcasts relevant events.

---

### `GetActiveStateObject`

Returns the currently active `UStateObject`.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | —    | —           |

**Returns:**
`UStateObject*` – Pointer to the active state object, or `nullptr` if no active state exists.

**Example:**

```cpp
UStateObject* ActiveState = Manager->GetActiveStateObject();
if(ActiveState)
{
    UE_LOG(LogTemp, Display, TEXT("Current active state: %s"), *ActiveState->GetName());
}
```

**Behavior Summary:**

* Delegates to `m_MasterStateObject->GetActiveStateObject()`.
* Supports nested states via the root state object if recursive tracking is implemented.

---

### `GetRootStateObject`

Returns the root/master state object managed by this component.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | —    | —           |

**Returns:**
`URootStateObject*` – The master/root state object.

**Behavior Summary:**

* Provides direct access to the master state for initialization, inspection, or advanced manipulation.

---

### Lifecycle Functions

#### `BeginPlay`

* Ensures `m_MasterStateObject` is valid.
* Initializes the master state object with this component as the owner.
* Marks the master state for entry and enters it.

#### `TickComponent`

* Ticks the master state each frame if it is active.
* Allows state-specific logic to run continuously.

---

### Usage Example

```cpp
// In your actor:
UGameStateManagerComponent* Manager = CreateDefaultSubobject<UGameStateManagerComponent>(TEXT("GameStateManager"));
Manager->m_MasterStateObject = CreateDefaultSubobject<URootStateObject_Tag>(TEXT("MasterState"));

// BeginPlay will initialize the master state automatically
```

**Behavior Summary:**

* The `UGameStateManagerComponent` acts as the interface for any actor to use a master state.
* All state transitions, updates, and event broadcasting occur through this component.
* Designed to integrate with nested, tagged, or general-purpose state machines.

## Summary

The `UGameStateManagerComponent` offers a centralized, actor-attached interface to manage a root or master state. It ensures consistent initialization, ticking, and transition handling, while exposing the active state to Blueprints and gameplay logic. Ideal for attaching global state systems to any actor in the game world.