
---

# URootStateObject_Nested Documentation

## Overview

`URootStateObject_Nested` extends `URootStateObject` and implements `IMasterState_TreeInterface`. It allows the creation of **nested state machines**, where each root state can manage multiple child states. Key features:

* Maintains a map of internal states keyed by class.
* Supports initial internal states on entry.
* Provides Blueprint and C++ methods for dynamic state management.
* Fully compatible with recursive state transitions.

---

## AddState_Implementation

**Description:**
Adds a new state object of the given class to the nested root state and registers it in the internal map.

| Parameter  | Type                        | Description                      |
| ---------- | --------------------------- | -------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to add |

**Example:**

```cpp
UStateObject* NewState = MyNestedRoot->AddState(MyStateClass);
```

**Behavior Summary:**

* Validates the state class.
* Checks for duplicates in the internal state map.
* Creates a new state object using `NewObject<UStateObject>()`.
* Initializes the state object (`Init(this)`).
* Adds it to `m_InternalStateMap`.
* Returns the created state object, or `nullptr` if invalid.

---

## GetStateObject_Implementation

**Description:**
Retrieves a state object from the internal state map, optionally creating it if it does not exist.

| Parameter           | Type                        | Description                                     |
| ------------------- | --------------------------- | ----------------------------------------------- |
| StateClass          | `TSubclassOf<UStateObject>` | Class of the state object to retrieve           |
| bCreateIfNotPresent | `bool`                      | If true, creates the state if it does not exist |

**Example:**

```cpp
UStateObject* State = MyNestedRoot->GetStateObject(MyStateClass, true);
```

**Behavior Summary:**

* Returns the state object if already present in `m_InternalStateMap`.
* If not present and `bCreateIfNotPresent` is true, calls `AddState_Implementation` to create it.
* Returns `nullptr` if the class is invalid or creation fails.

---

## AddInternalState (Override)

**Description:**
Wrapper for adding internal states, calls `AddState_Implementation` to maintain consistent management of the internal state map.

| Parameter  | Type                        | Description                      |
| ---------- | --------------------------- | -------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to add |

**Example:**

```cpp
UStateObject* InternalState = MyNestedRoot->AddInternalState(MyStateClass);
```

**Behavior Summary:**

* Delegates state creation to `AddState_Implementation`.
* Ensures all internal states are tracked in `m_InternalStateMap`.

---

## StateEntered_Implementation (Override)

**Description:**
Handles the logic for entering the nested root state. Automatically attempts to enter the **initial internal state**, if defined.

**Example:**

```cpp
MyNestedRoot->StateEntered();
```

**Behavior Summary:**

* Calls the base `StateEntered_Implementation`.
* Checks if `m_InitialStateClass` is valid.
* Attempts a state transition to the initial internal state using `AttemptStateTransition`.
* Logs all transitions for debugging.

---

## StateExited_Implementation (Override)

**Description:**
Handles logic for exiting the nested root state. Caches the currently active internal state for potential reuse.

**Example:**

```cpp
MyNestedRoot->StateExited();
```

**Behavior Summary:**

* Stores the current `m_ActiveInternalState` class in `m_InitialStateClass`.
* Calls base `StateExited_Implementation`.
* Ensures proper exit of all active internal states.

---

## Properties

| Name                | Type                                                        | Description                                                           |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| m_InitialStateClass | `TSubclassOf<UStateObject>`                                 | The initial internal state to enter when this root state is entered   |
| m_InternalStateMap  | `TMap<TSubclassOf<UStateObject>, TObjectPtr<UStateObject>>` | Map of internal states keyed by class for quick access and management |

---

## Use Cases

* Nested state machines for AI, game logic, or global systems.
* Persistent tracking of internal states in complex scenarios.
* Dynamic creation and management of states at runtime.
* Easily extendable for recursive or hierarchical state systems.

## Summary 

`URootStateObject_Nested` extends the master state concept with class-based state mapping and initial state management. It enables dynamic creation and lookup of internal states, providing a flexible solution for AI behavior trees, modular game logic, or other systems where states must be efficiently referenced and controlled programmatically.