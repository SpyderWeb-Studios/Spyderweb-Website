
# URootStateObject_Tag Documentation

## Overview

`URootStateObject_Tag` extends `URootStateObject` and implements `IMasterState_TagInterface`. It allows **tag-based management of internal states**, enabling flexible queries and transitions based on gameplay tags rather than explicit class references. Key features:

* Maintains a list of internal states with associated tags.
* Supports querying states using `FGameplayTagQuery`.
* Allows adding states with tags dynamically at runtime.
* Can automatically transition to initial states defined by a tag query.
* Fully compatible with Blueprint and C++ workflows.

---

## AddStateClassWithTags_Implementation

**Description:**
Creates a new state object of the specified class, applies the provided tags, and registers it with the internal tag state system.

| Parameter  | Type                        | Description                                 |
| ---------- | --------------------------- | ------------------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to create         |
| Tags       | `FGameplayTagContainer`     | Tags to associate with the state            |
| OutState   | `UStateObject*&`            | Reference to the newly created state object |

**Example:**

```cpp
UStateObject* NewState = nullptr;
MyTagRoot->AddStateClassWithTags(MyStateClass, Tags, NewState);
```

**Behavior Summary:**

* Validates the class.
* Creates a new `UStateObject`.
* Initializes it with the root as the owner.
* Appends tags to the state’s existing tags.
* Registers the state in `m_States` via `AddStateWithTags_Implementation`.
* Broadcasts `OnTagStateAdded` delegate.

---

## AddStateWithTags_Implementation

**Description:**
Adds an existing `UStateObject` to the internal tag system and associates it with the given tags.

| Parameter   | Type                    | Description                      |
| ----------- | ----------------------- | -------------------------------- |
| StateObject | `UStateObject*`         | The state object to add          |
| Tags        | `FGameplayTagContainer` | Tags to associate with the state |

**Example:**

```cpp
MyTagRoot->AddStateWithTags(MyExistingState, Tags);
```

**Behavior Summary:**

* Validates inputs.
* If state already exists, adds tags to it.
* Adds the state to `m_States` if not already present.
* Broadcasts `OnTagStateAdded` delegate.

---

## GetFirstStateByTagQuery_Implementation

**Description:**
Finds the first internal state whose tags match a given `FGameplayTagQuery`.

| Parameter | Type                | Description                           |
| --------- | ------------------- | ------------------------------------- |
| TagQuery  | `FGameplayTagQuery` | Tag query to match against state tags |
| OutState  | `UStateObject*&`    | Reference to the first matching state |

**Example:**

```cpp
UStateObject* ResultState = nullptr;
MyTagRoot->GetFirstStateByTagQuery(MyQuery, ResultState);
```

**Behavior Summary:**

* Iterates through all internal states.
* Returns the first state whose tags match the query.
* Returns `nullptr` if no state matches.

---

## GetStatesByTagQuery_Implementation

**Description:**
Returns all internal states that match a given `FGameplayTagQuery`.

| Parameter | Type                     | Description                            |
| --------- | ------------------------ | -------------------------------------- |
| TagQuery  | `FGameplayTagQuery`      | Tag query to match against state tags  |
| OutStates | `TArray<UStateObject*>&` | Array to populate with matching states |

**Example:**

```cpp
TArray<UStateObject*> MatchingStates;
MyTagRoot->GetStatesByTagQuery(MyQuery, MatchingStates);
```

**Behavior Summary:**

* Iterates through all internal states.
* Populates `OutStates` with all matching states.
* Clears `OutStates` before populating to ensure no stale data.

---

## StateEntered_Implementation (Override)

**Description:**
Called when the root state is entered. Automatically transitions to the **initial state(s)** defined by `InitialStateTagQuery`.

**Example:**

```cpp
MyTagRoot->StateEntered();
```

**Behavior Summary:**

* Calls the base `StateEntered_Implementation`.
* Executes `GetFirstStateByTagQuery` with `InitialStateTagQuery`.
* Attempts to transition to the matched initial state.

---

## AddInternalState (Override)

**Description:**
Creates a new internal state of the specified class without predefined tags.

| Parameter  | Type                        | Description                         |
| ---------- | --------------------------- | ----------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to create |

**Example:**

```cpp
UStateObject* NewInternalState = MyTagRoot->AddInternalState(MyStateClass);
```

**Behavior Summary:**

* Delegates to `AddStateClassWithTags_Implementation` with an empty tag container.
* Returns the created state object.

---

## Init (Override)

**Description:**
Initializes the root state and registers any instanced initial states.

| Parameter | Type       | Description               |
| --------- | ---------- | ------------------------- |
| Owner     | `UObject*` | Owner of the state object |

**Example:**

```cpp
MyTagRoot->Init(MyOwner);
```

**Behavior Summary:**

* Calls the base `Init` function.
* Iterates through `InstancedInitialStates`.
* Adds each state to the internal tag map.
* Ensures all initial states are ready for tag-based queries.

---

## Properties

| Name                 | Type                    | Description                                              |
| -------------------- | ----------------------- | -------------------------------------------------------- |
| m_States             | `TArray<UStateObject*>` | Array of internal states managed by tags                 |
| InitialStateTagQuery | `FGameplayTagQuery`     | Tag query defining which state to enter initially        |
| OnTagStateAdded      | `FOnTagStateAdded`      | Event delegate triggered when a state is added with tags |

---

## Use Cases

* Systems where states are selected based on gameplay context (e.g., AI modes, environmental states, UI contexts).
* Dynamic creation of states with flexible tag-based querying.
* Supports hierarchical and independent state management for complex game systems.

## Summary

`URootStateObject_Tag` allows developers to manage and query states by tags, rather than by class. With tag-based transitions, initial state queries, and event notifications, it supports event-driven state management and is perfect for scenario-based gameplay, tagged experiment conditions, or flexible environmental systems.