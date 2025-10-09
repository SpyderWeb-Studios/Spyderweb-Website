
# Master State Interfaces Documentation

## Overview

The **Master State Interfaces** provide a modular way to extend `URootStateObject` functionality in subclasses, enabling flexible state management. They allow:

* Dynamic retrieval or creation of internal states.
* Tag-based queries for selective state access.
* Custom extensions for managing internal states independently in different subclasses.

These interfaces separate state management logic from the core `RootStateObject` class, making your state system more modular and maintainable.

---

## IMasterState_TreeInterface

### Overview

`IMasterState_TreeInterface` defines methods to manage a hierarchical tree of state objects. It provides functions to retrieve or add states dynamically.

---

### GetStateObject

**Description:**
Returns a state object of the specified class. Can optionally create the state if it does not exist.

| Parameter           | Type                        | Description                                                   |
| ------------------- | --------------------------- | ------------------------------------------------------------- |
| StateClass          | `TSubclassOf<UStateObject>` | Class of the state object to retrieve                         |
| bCreateIfNotPresent | `bool`                      | If true, creates the state if it doesn’t exist. Default: true |

**Example:**

```cpp
UStateObject* MyState = MyRootState->GetStateObject(MyStateClass, true);
```

**Behavior Summary:**

* Searches the internal state collection for a matching state.
* If `bCreateIfNotPresent` is true and the state doesn’t exist, it is instantiated.
* Returns a pointer to the state object or `nullptr` if not found and not created.

---

### AddState

**Description:**
Adds a new state instance of the specified class to the root state.

| Parameter  | Type                        | Description                      |
| ---------- | --------------------------- | -------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to add |

**Example:**

```cpp
UStateObject* NewState = MyRootState->AddState(MyStateClass);
```

**Behavior Summary:**

* Instantiates a new state object of the given class.
* Registers it in the internal state collection.
* Returns the created state object.

---

## IMasterState_TagInterface

### Overview

`IMasterState_TagInterface` defines methods for **tag-based querying** and management of state objects. Useful for selecting states by gameplay tags or adding states with tags.

---

### GetStatesByTagQuery

**Description:**
Retrieves all states matching a given `FGameplayTagQuery`.

| Parameter | Type                     | Description                           |
| --------- | ------------------------ | ------------------------------------- |
| TagQuery  | `FGameplayTagQuery`      | Query used to filter states by tags   |
| OutStates | `TArray<UStateObject*>&` | Array to store matching state objects |

**Example:**

```cpp
TArray<UStateObject*> MatchingStates;
MyRootState->GetStatesByTagQuery(MyTagQuery, MatchingStates);
```

**Behavior Summary:**

* Searches the internal state collection for states that match the tag query.
* Adds all matching states to `OutStates`.

---

### GetFirstStateByTagQuery

**Description:**
Retrieves the first state that matches a given `FGameplayTagQuery`.

| Parameter | Type                | Description                             |
| --------- | ------------------- | --------------------------------------- |
| TagQuery  | `FGameplayTagQuery` | Query used to filter states by tags     |
| OutState  | `UStateObject*&`    | Returns the first matching state object |

**Example:**

```cpp
UStateObject* FirstMatchingState = nullptr;
MyRootState->GetFirstStateByTagQuery(MyTagQuery, FirstMatchingState);
```

**Behavior Summary:**

* Searches for the first internal state that satisfies the tag query.
* Returns it via `OutState`.

---

### AddStateClassWithTags

**Description:**
Adds a new state class instance and assigns a set of gameplay tags.

| Parameter  | Type                        | Description                      |
| ---------- | --------------------------- | -------------------------------- |
| StateClass | `TSubclassOf<UStateObject>` | Class of the state object to add |
| Tags       | `FGameplayTagContainer`     | Tags to assign to the new state  |
| OutState   | `UStateObject*&`            | Returns the created state object |

**Example:**

```cpp
UStateObject* NewTaggedState = nullptr;
MyRootState->AddStateClassWithTags(MyStateClass, MyTags, NewTaggedState);
```

**Behavior Summary:**

* Instantiates the state object.
* Assigns the provided tags to it.
* Registers the state within the root state.

---

### AddStateWithTags

**Description:**
Adds an existing state object and assigns a set of gameplay tags.

| Parameter   | Type                    | Description                 |
| ----------- | ----------------------- | --------------------------- |
| StateObject | `UStateObject*`         | State object to add         |
| Tags        | `FGameplayTagContainer` | Tags to assign to the state |

**Example:**

```cpp
MyRootState->AddStateWithTags(ExistingStateObject, MyTags);
```

**Behavior Summary:**

* Associates an existing state object with the root state.
* Assigns the specified tags for querying and filtering.

---

## Use Cases

* **Tree Interface:**

  * Dynamic creation and retrieval of internal states.
  * Suitable for hierarchical state machines where states may not always exist initially.

* **Tag Interface:**

  * Tag-driven state management.
  * Useful for selecting subsets of states based on gameplay context.
  * Enables modular, extensible systems where states can be referenced via tags rather than explicit class types.

---

This structure allows subclasses of `URootStateObject` to implement these interfaces and manage their internal states independently, providing a flexible foundation for complex, reusable state systems.

It allow means that you can define your own interfaces, for even more control over how the `URootStateObject` behaves under certain conditions.
