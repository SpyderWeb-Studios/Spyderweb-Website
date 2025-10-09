
# `URootStateObject`

The `URootStateObject` extends the core `UStateObject` class to support **nested or hierarchical state machines**.
It allows a parent (“root”) state to contain and manage **internal states**, each with its own logic and lifecycle.

This makes it ideal for **complex systems** such as:

* Multi-phase experimental blocks (e.g., *Preparation → Trial → Feedback → Rest*)
* Hierarchical AI or behavior controllers
* Multi-layered environment systems (e.g., *Weather → Rain → Thunderstorm*)

---

## Overview

A `URootStateObject` acts as a **state container**, managing its own lifecycle while coordinating transitions between its internal child states.
It supports full authority checks, clean transitions, and event-driven notifications for when internal states change.

When combined with `ULeafStateObject`, you can create scalable and maintainable **nested state hierarchies**.

---

## Key Features

* **Nested States:** Supports internal `UStateObject` instances for hierarchical state logic.
* **Controlled Transitions:** Handles safe state entry and exit with validation checks.
* **Event Driven:** Emits a delegate whenever an internal state transition occurs.
* **Recursive Access:** Retrieve the currently active state even through nested `URootStateObject` layers.
* **Blueprint Integration:** Fully accessible and extensible from Blueprints.

---

## Usage Example

```cpp
UCLASS()
class UExperimentRootState : public URootStateObject
{
    GENERATED_BODY()

    virtual void OnInternalStateTransition_Implementation(UStateObject* OldState, UStateObject* NewState) override
    {
        Super::OnInternalStateTransition_Implementation(OldState, NewState);
        UE_LOG(LogTemp, Display, TEXT("Transitioned from %s to %s"), *GetNameSafe(OldState), *GetNameSafe(NewState));
    }
};
```

In Blueprint, you can derive your own root state and assign internal sub-states directly in the editor using the **Instanced Initial States** array.

---

## Core Methods

### AttemptStateTransition

**Description:**
Attempts to transition from the current active internal state to a target internal state.

| Parameter   | Type            | Description                  |
| ----------- | --------------- | ---------------------------- |
| TargetState | `UStateObject*` | The state to transition into |

**Example:**

```cpp
URootStateObject* MasterState = NewObject<URootStateObject>();
UStateObject* NextState = NewObject<UStateObject>();
MasterState->AttemptStateTransition(NextState);
```

**Behavior Summary:**

* Checks if the root state is active.
* Verifies if `TargetState` can be entered and current state can exit.
* Marks target for entry and active state for exit.
* Executes state transitions and broadcasts `PostInternalStateTransition`.

---

### GetActiveStateObject

**Description:**
Returns the currently active internal state. Optionally retrieves the deepest active state recursively.

| Parameter  | Type   | Description                                                                                                   |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| bRecursive | `bool` | If true, returns the deepest active nested state; otherwise, returns the immediate child state. Default: true |

**Example:**

```cpp
UStateObject* ActiveState = MasterState->GetActiveStateObject(true);
```

**Behavior Summary:**

* Returns `nullptr` if no internal state is active.
* Recursively navigates internal `URootStateObject` children if `bRecursive` is true.
* Useful for querying the current effective state of a nested state machine.

---

### AddInternalState

**Description:**
Adds a new internal state instance to the root state.

| Parameter  | Type                        | Description                        |
| ---------- | --------------------------- | ---------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the internal state to add |

**Example:**

```cpp
UStateObject* NewState = MasterState->AddInternalState(MyStateClass);
```

**Behavior Summary:**

* Creates or registers a new internal state instance.
* Returns a pointer to the added state.
* Designed to allow dynamic state machine configuration at runtime.

---

### OnInternalStateTransition

**Description:**
BlueprintNativeEvent called when an internal state transition occurs.

| Parameter | Type            | Description             |
| --------- | --------------- | ----------------------- |
| OldState  | `UStateObject*` | The state being exited  |
| NewState  | `UStateObject*` | The state being entered |

**Example (Blueprint):**

* Implement `OnInternalStateTransition` to update UI or trigger events when internal state changes.

**Behavior Summary:**

* Broadcasts `PostInternalStateTransition` delegate.
* Provides hooks for both Blueprint and C++ responses to internal transitions.

---

### StateExited (Override)

**Description:**
Handles the exit of the root state and any active internal state.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | -    | -           |

**Example:**

```cpp
MasterState->SetStateFlag(static_cast<int32>(EStateFlags::MarkForExit));
MasterState->ExitState();
```

**Behavior Summary:**

* Exits the root state and recursively exits the active internal state.
* Clears active internal state pointer.
* Broadcasts events for root and internal state exits.

---

## Properties

* **m_ActiveInternalState** (`UStateObject*`) – The currently active internal state.
* **InstancedInitialStates** (`TArray<ULeafStateObject*>`) – Internal states initially instantiated within the root state.
* **PostInternalStateTransition** – Delegate broadcast after a successful internal state transition.

---

## Use Cases

* Hierarchical state machines for complex game logic.
* Multi-phase experiments, day/night cycles, or per-level systems.
* Nested state handling with both Blueprint and C++ integration.

---

## Example Usage

```cpp
// Create master state
URootStateObject* MasterState = NewObject<URootStateObject>();

// Add internal states
UStateObject* StateA = MasterState->AddInternalState(StateAClass);
UStateObject* StateB = MasterState->AddInternalState(StateBClass);

// Transition to a new internal state
MasterState->AttemptStateTransition(StateA);
MasterState->AttemptStateTransition(StateB);

// Retrieve the currently active state recursively
UStateObject* ActiveState = MasterState->GetActiveStateObject(true);
```

**Behavior Summary:**

* Allows centralized control over multiple internal states.
* Supports both runtime state creation and nested transitions.
* Enables modular and reusable state logic across Blueprints and C++.


---

## Typical Use Cases

* **Experiment Block Management**
  A `URootStateObject` can represent a complete experiment phase, with internal sub-states for each trial stage.

* **Hierarchical Game Phases**
  Use a root state for “Match Flow” (e.g., *Lobby → Countdown → Playing → End*).

* **Environment and Simulation Layers**
  Represent a global “Weather State” root, with internal states for *Clear*, *Rainy*, *Stormy*, etc.

* **AI Behavior Sequencing**
  Define a master AI control state that transitions between *Idle*, *Investigate*, and *Attack* child states.

---

## Summary

The `URootStateObject` is a master state container capable of managing nested internal states. By combining internal state transitions, active state tracking, and event broadcasting, it supports the creation of complex, hierarchical state machines suitable for multi-stage gameplay, experiment blocks, or environmental systems.