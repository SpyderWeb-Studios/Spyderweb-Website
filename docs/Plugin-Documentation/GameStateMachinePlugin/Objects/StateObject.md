
# `UStateObject`

UCLASS Specifiers: `Abstract, DefaultToInstanced, EditInlineNew, Blueprintable, BlueprintType, meta = (ShowWorldContextPin)` 


The `UStateObject` class provides the **foundation for global or system-level state management** within Unreal Engine.
Originally designed for **psychology experiments**, **day–night cycles**, and **gameflow control**, it enables developers to define **modular, event-driven states** that can manage transitions, timing, and logic across entire systems — not just individual players.

---

## Overview

`UStateObject` represents a **self-contained, reusable state unit**.
Each state defines its own **entry**, **update**, and **exit** behavior, along with validation checks, flags, and gameplay tags for semantic labeling.

Unlike traditional per-player or per-AI states, this class is built for **broad application**, including:

* Experiment flow management (e.g., trial → feedback → rest → next block)
* Global systems (e.g., day/night cycle, game phases)
* Environmental or world-level logic control

---

## Core Concepts

* **Lifecycle-Based** — States move through *Enter*, *Update*, and *Exit* phases with full event support.
* **Flag-Driven** — Internally uses bitmask flags (`EStateFlags`) to track activity, pause, and transition conditions.
* **Tag-Aware** — Integrates with `GameplayTags` to describe and query states semantically.
* **Fully Event-Based** — Supports `Pre/Post` delegates for every transition, enabling external systems to observe or synchronize behavior.

---

## Lifecycle Methods

| Function                          | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| `bool EnterState()`               | Activates the state, validating entry conditions and updating flags. |
| `bool UpdateState()`              | Updates the state logic each tick or frame cycle.                    |
| `bool ExitState()`                | Cleanly deactivates the state and resets its flags.                  |
| `void TickState(float DeltaTime)` | Optional per-frame update hook for continuous logic.                 |

### Validation

| Function           | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `CanEnterState()`  | Determines whether the state can be entered. (Default: `true`) |
| `CanUpdateState()` | Determines whether the state can be updated. (Default: `true`) |
| `CanExitState()`   | Determines whether the state can be exited. (Default: `true`)  |

---

## Event Flow

Each transition stage emits **pre/post delegates** for precise lifecycle tracking:

| Delegate                               | Triggered When                       |
| -------------------------------------- | ------------------------------------ |
| `PreStateEntered` / `PostStateEntered` | Before and after entering the state. |
| `PreStateUpdated` / `PostStateUpdated` | Before and after each update.        |
| `PreStateExited` / `PostStateExited`   | Before and after exiting the state.  |

Additional general-purpose events:

| Delegate               | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `OnStateEntered`       | Fired when a state is successfully entered.        |
| `OnStateUpdated`       | Fired each time a state is updated.                |
| `OnStateExited`        | Fired when the state exits.                        |
| `OnStateExitAttempted` | Fired when an exit is attempted but not completed. |

---

## Core Methods

### EnterState

**Description:**
Attempts to enter the state, activating it if allowed and broadcasting `PreStateEntered` and `PostStateEntered` events.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | -    | -           |

**Example:**

```cpp
UStateObject* MyState = NewObject<UStateObject>();
MyState->SetStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
bool bEntered = MyState->EnterState();
```

**Behavior Summary:**

* Checks if state is marked for entry and not already active.
* Sets the `Active` flag and clears `MarkForEntry`.
* Calls `StateEntered()` and `K2_StateEntered()` to allow Blueprint-specific behavior.
* Broadcasts `PreStateEntered` and `PostStateEntered`.

---

### UpdateState

**Description:**
Updates the state, incrementing internal indices and broadcasting update events.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | -    | -           |

**Example:**

```cpp
MyState->UpdateState();
```

**Behavior Summary:**

* Only updates active states.
* Calls `StateUpdated()` and `K2_StateUpdated()` with internal index.
* Broadcasts `PreStateUpdated` and `PostStateUpdated`.

---

### ExitState

**Description:**
Attempts to exit the state if active and marked for exit.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | -    | -           |

**Example:**

```cpp
MyState->SetStateFlag(static_cast<int32>(EStateFlags::MarkForExit));
bool bExited = MyState->ExitState();
```

**Behavior Summary:**

* Ensures state is active and marked for exit.
* Clears `Active` and `MarkForExit` flags.
* Calls `StateExited()` and `K2_StateExited()`.
* Broadcasts `PreStateExited` and `PostStateExited`.

---

### TickState

**Description:**
Called every frame (BlueprintNativeEvent), allowing custom per-frame updates for the state.

| Parameter | Type  | Description                   |
| --------- | ----- | ----------------------------- |
| DeltaTime | float | Time elapsed since last frame |

**Example:**

```cpp
MyState->TickState(DeltaTime);
```

**Behavior Summary:**

* BlueprintNativeEvent allows override in Blueprints.
* Default implementation is empty.
* Can be used for continuous behaviors like timers or animations.

---

### CanEnterState / CanUpdateState / CanExitState

**Description:**
Check if the state can enter, update, or exit, respectively.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| None      | -    | -           |

**Example:**

```cpp
if(MyState->CanEnterState()) {
    MyState->EnterState();
}
```

**Behavior Summary:**

* Returns a boolean indicating whether the state can transition.
* Default implementations return `true`.
* Can be overridden to enforce custom logic.

---

### State Flag Functions

* **`HasStateFlag(int32 Flag)`:** Returns true if the specific flag is set.
* **`HasAnyStateFlags(int32 Flags)`:** Returns true if any of the given flags are set.
* **`HasAllStateFlags(int32 Flags)`:** Returns true if all of the given flags are set.
* **`SetStateFlag(int32 Flag)`:** Sets a specific state flag.
* **`ClearStateFlag(int32 Flag)`:** Clears a specific state flag.

**Example:**

```cpp
if(!MyState->HasStateFlag(static_cast<int32>(EStateFlags::Paused)))
{
    MyState->SetStateFlag(static_cast<int32>(EStateFlags::Paused));
}
```

**Behavior Summary:**

* Flags control internal state behavior and transition eligibility.
* Supports bitmask operations for multiple simultaneous flags.

---

### State Tags

* **`GetStateTags()`:** Returns the `FGameplayTagContainer` associated with this state.
* **`SetStateTags(FGameplayTagContainer Tags)`:** Replaces current tags.
* **`AddStateTags(FGameplayTagContainer Tags)`:** Appends tags.
* **`RemoveStateTags(FGameplayTagContainer Tags)`:** Removes tags.

**Example:**

```cpp
MyState->AddStateTags(NewTags);
```

**Behavior Summary:**

* Tags allow semantic categorization of states.
* Useful for querying or filtering active states.

---

### Event Delegates

* `PreStateEntered` / `PostStateEntered`
* `PreStateUpdated` / `PostStateUpdated`
* `PreStateExited` / `PostStateExited`
* `OnStateEntered` / `OnStateUpdated` / `OnStateExited` / `OnStateExitAttempted`

**Behavior Summary:**

* Delegates allow Blueprint or C++ to respond to state lifecycle events.
* Triggered automatically during `EnterState`, `UpdateState`, and `ExitState`.


### Native Events

| Function                  | Description                       |
| ------------------------- | --------------------------------- |
| `StateEntered()`          | Called when the state is entered. |
| `StateUpdated(int Index)` | Called when the state updates.    |
| `StateExited()`           | Called when the state exits.      |

### Blueprint Implementable Events

| Function                     | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| `K2_Init(UObject* Owner)`    | Called when the state is initialized with its owner (e.g., a manager). |
| `K2_StateEntered()`          | Executed in Blueprint when entering.                                   |
| `K2_StateUpdated(int Index)` | Executed in Blueprint each update tick.                                |
| `K2_StateExited()`           | Executed in Blueprint when exiting.                                    |

---

## Flags

`UStateObject` uses bitmask flags (from `EStateFlags`) to track internal state conditions such as *Active*, *Paused*, *MarkForEntry*, or *MarkForExit*.

| Function                        | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| `HasStateFlag(int32 Flag)`      | Checks whether a flag is set.                          |
| `HasAnyStateFlags(int32 Flags)` | Returns true if any of the specified flags are active. |
| `HasAllStateFlags(int32 Flags)` | Returns true if all specified flags are active.        |
| `SetStateFlag(int32 Flag)`      | Activates one or more flags.                           |
| `ClearStateFlag(int32 Flag)`    | Clears one or more flags.                              |

---

## Tags

`UStateObject` supports the `GameplayTagContainer` system to semantically describe states.

| Function                                             | Description                 |
| ---------------------------------------------------- | --------------------------- |
| `GetStateTags()`                                     | Returns the state’s tags.   |
| `AddStateTags(const FGameplayTagContainer& Tags)`    | Adds new tags.              |
| `RemoveStateTags(const FGameplayTagContainer& Tags)` | Removes tags.               |
| `SetStateTags(const FGameplayTagContainer& Tags)`    | Replaces the tag container. |

---

## Initialization

| Function               | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `Init(UObject* Owner)` | Initializes the state and binds it to an owning system or actor. |

---

## Typical Use Cases

* **Psychology or UX Experiments**
  Automate progression between experiment blocks, stimulus presentations, and rest phases.

* **Environmental Systems**
  Control transitions between global states such as *Day → Night*, *Sunny → Rainy*, or *Calm → Storm*.

* **Game Progression or Sequences**
  Define structured flow between phases — e.g., *Lobby → Gameplay → Results → Reset*.

---

## Summary

The `UStateObject` system provides a **generic, modular, and extensible** state framework suited for **experiments, global game systems, or environmental management**. By combining **flag-based control**, **event-driven transitions**, and **Blueprint extensibility**, it enables developers to create clear, reusable, and observable state logic across any Unreal Engine project.
