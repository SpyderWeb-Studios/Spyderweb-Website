
---

# **Game State Management – State Objects Documentation**

## **Overview**

The `UStateObject` system provides a **generic, modular, and extensible** state framework suited for **experiments, global game systems, or environmental management**.
By combining **flag-based control**, **event-driven transitions**, and **Blueprint extensibility**, it enables developers to create clear, reusable, and observable state logic across any Unreal Engine project.

---

## **Classes**

### **1. UStateObject**

**Summary:**
The `UStateObject` is the **core base class** for all states. It supports lifecycle events, flag-based control, and Blueprint overrides. States can be activated, updated, and exited while broadcasting events at each stage.

**Key Features:**

* Supports `EnterState()`, `UpdateState()`, `ExitState()`, and `TickState()`.
* Flag-based state control using `EStateFlags` (Active, MarkForEntry, MarkForExit, Paused).
* Event-driven design with multicast delegates for pre/post lifecycle events.
* Blueprint extensible: implement `K2_Init`, `K2_StateEntered`, `K2_StateExited`, `K2_StateUpdated`.
* Can be used as a **standalone state** or a **child state in master/root state objects**.

**Example Usage:**

```cpp
UStateObject* State = NewObject<UStateObject>();
State->Init(SomeOwner);
State->SetStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
State->EnterState();
```

**Behavior:**

* Modular: can be extended or overridden in Blueprints.
* Broadcasts state events for external listeners.
* Fully supports flag-based checks and updates.

---

### **2. ULeafStateObject**

**Summary:**
`ULeafStateObject` is a **terminal state** that cannot have child states. Ideal for **endpoints, single actions, or final stages** in a state machine.

**Key Features:**

* Atomic state with no internal children.
* Supports full lifecycle (`Enter`, `Update`, `Exit`, `Tick`).
* Integrates with root/master state systems.
* Blueprint extensible and event-driven.

**Example Usage:**

```cpp
ULeafStateObject* Leaf = NewObject<ULeafStateObject>();
Leaf->Init(SomeOwner);
Leaf->SetStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
Leaf->EnterState();
```

**Behavior:**

* Always represents a **final or discrete action**.
* Cannot contain nested states.
* Works as a leaf in hierarchical state systems.

---

### **3. URootStateObject**

**Summary:**
The `URootStateObject` is a **master state** capable of holding and managing **internal child states**. Useful for creating complex state hierarchies or nested state machines.

**Key Features:**

* Manages an active internal state (`m_ActiveInternalState`).
* Supports transitions between internal states using `AttemptStateTransition()`.
* Event-driven internal state notifications via `PostInternalStateTransition`.
* Flag-based control for nested state management.
* Blueprint extensible (`OnInternalStateTransition`).

**Example Usage:**

```cpp
URootStateObject* Root = NewObject<URootStateObject>();
Root->Init(SomeOwner);
Root->EnterState();
Root->AttemptStateTransition(SomeChildState);
```

**Behavior:**

* Can recursively resolve the active child state (`GetActiveStateObject(true)`).
* Tracks entry and exit of child states.
* Supports hierarchical state logic for **nested state machines**.

---

### **4. URootStateObject_Nested**

**Summary:**
A concrete subclass of `URootStateObject` implementing `IMasterState_TreeInterface` for **programmatically adding and managing child states**.

**Key Features:**

* Stores child states in a map (`m_InternalStateMap`).
* Supports initial state entry via `m_InitialStateClass`.
* Blueprint and code extensible.
* Implements `AddState` and `GetStateObject` interfaces.

**Example Usage:**

```cpp
URootStateObject_Nested* Nested = NewObject<URootStateObject_Nested>();
Nested->AddState(SomeStateClass);
Nested->StateEntered();
```

**Behavior:**

* Automatically enters an initial internal state on activation.
* Manages state map and ensures unique child states.
* Maintains hierarchical state consistency.

---

### **5. URootStateObject_Tag**

**Summary:**
A subclass of `URootStateObject` implementing `IMasterState_TagInterface`, allowing states to be queried and managed **via gameplay tags**.

**Key Features:**

* Stores all states in `m_States`.
* Supports querying by `FGameplayTagQuery`.
* Allows adding states with tags (`AddStateWithTags`).
* Initial state determined via `InitialStateTagQuery`.
* Event-driven state addition (`OnTagStateAdded`).

**Example Usage:**

```cpp
URootStateObject_Tag* TagRoot = NewObject<URootStateObject_Tag>();
TagRoot->AddStateClassWithTags(SomeStateClass, Tags, OutState);
TagRoot->StateEntered();
```

**Behavior:**

* Enables **flexible state selection via tags**.
* Integrates with nested and leaf states.
* Broadcasts tag-based events for external listeners.

---

### **6. UGameStateManagerComponent**

**Summary:**
A **component-based interface** for managing a `URootStateObject` within an Actor. Provides **easy access, ticking, and state transitions** in Blueprint and code.

**Key Features:**

* Holds a root/master state object (`m_MasterStateObject`).
* Ticks the root state each frame.
* Exposes `AttemptStateTransition()` and `GetActiveStateObject()`.
* Broadcasts transitions via `OnStateTransition` and `OnStateTransitionEvent`.
* Blueprint-friendly for per-Actor state management.

**Example Usage:**

```cpp
UGameStateManagerComponent* Manager = Actor->FindComponentByClass<UGameStateManagerComponent>();
Manager->AttemptStateTransition(TargetState);
UStateObject* Active = Manager->GetActiveStateObject();
```

**Behavior:**

* Serves as a centralized interface to manage states per actor.
* Integrates root/master and leaf states seamlessly.
* Automatically initializes the master state on `BeginPlay`.

---

## **Interfaces**

Interfaces and flags provide **flexible access patterns, tagging, and modular control** for your state system.
They enable developers to extend `URootStateObject` in **different ways**, query states efficiently, and manage transitions reliably.

### **1. IMasterState_TreeInterface**

**Summary:**
This interface allows `URootStateObject` subclasses to manage child states as a **hierarchical tree**. Useful for programmatic access and dynamic state creation.

**Functions:**

| Function         | Description                                                           | Parameters                                                                                                                             | Returns                                           |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `GetStateObject` | Retrieves a child state, optionally creating it if it does not exist. | `TSubclassOf<UStateObject> StateClass` – The class of the desired state.<br>`bool bCreateIfNotPresent` – Whether to create if missing. | `UStateObject*` – The child state object.         |
| `AddState`       | Adds a child state of the specified class.                            | `TSubclassOf<UStateObject> StateClass` – Class to add.                                                                                 | `UStateObject*` – The newly created state object. |

**Behavior:**

* Enables dynamic state tree management.
* Ensures unique child states per master/root state.
* Integrates with `URootStateObject_Nested`.

**Example Usage:**

```cpp
UStateObject* State = NestedRoot->GetStateObject(MyStateClass, true);
NestedRoot->AddState(AnotherStateClass);
```

---

### **2. IMasterState_TagInterface**

**Summary:**
This interface allows `URootStateObject` subclasses to manage states via **Gameplay Tags**, supporting querying, filtering, and batch operations.

**Functions:**

| Function                  | Description                                         | Parameters                                                                                      | Returns                     |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------- |
| `GetStatesByTagQuery`     | Retrieves all states matching a tag query.          | `FGameplayTagQuery TagQuery`, `TArray<UStateObject*>& OutStates`                                | None (output via array)     |
| `GetFirstStateByTagQuery` | Retrieves the first state matching a tag query.     | `FGameplayTagQuery TagQuery`, `UStateObject*& OutState`                                         | None (output via reference) |
| `AddStateClassWithTags`   | Adds a new state of a given class and assigns tags. | `TSubclassOf<UStateObject> StateClass`, `FGameplayTagContainer Tags`, `UStateObject*& OutState` | None (output via reference) |
| `AddStateWithTags`        | Adds an existing state object and assigns tags.     | `UStateObject* StateObject`, `FGameplayTagContainer Tags`                                       | None                        |

**Behavior:**

* Supports **querying and filtering states dynamically** via tags.
* Initial states can be determined by tag queries.
* Works seamlessly with `URootStateObject_Tag`.

**Example Usage:**

```cpp
TArray<UStateObject*> FilteredStates;
TagRoot->GetStatesByTagQuery(MyTagQuery, FilteredStates);

UStateObject* FirstState = nullptr;
TagRoot->GetFirstStateByTagQuery(MyTagQuery, FirstState);
```

---

## **Flags**

### **EStateFlags**

**Summary:**
Flags are used to control and track the state lifecycle of `UStateObject`. They provide **efficient bitmask checks** for entry, exit, and active status.

**Enum Values:**

| Flag           | Description                  |
| -------------- | ---------------------------- |
| `None`         | No state flags set.          |
| `MarkForEntry` | State is queued to enter.    |
| `MarkForExit`  | State is queued to exit.     |
| `Active`       | State is currently active.   |
| `Paused`       | State is temporarily paused. |

**Behavior:**

* Flags prevent invalid transitions (e.g., entering an active state).
* Combined with state methods, flags enable robust **state validation**.
* Supports bitmask operations (`HasStateFlag`, `HasAnyStateFlags`, `HasAllStateFlags`, `SetStateFlag`, `ClearStateFlag`).

**Example Usage:**

```cpp
if(State->HasStateFlag(static_cast<int32>(EStateFlags::Active)))
{
    State->ExitState();
}
State->SetStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
```

---

### **Integration Example**

Combining **interfaces** and **flags** allows flexible, tag-based, hierarchical state machines:

```cpp
// Retrieve or create a child state dynamically
UStateObject* Child = NestedRoot->GetStateObject(MyStateClass, true);

// Tag the state for filtering
TagRoot->AddStateWithTags(Child, MyTags);

// Check flags before transitions
if(Child->HasStateFlag(static_cast<int32>(EStateFlags::MarkForEntry)))
{
    Child->EnterState();
}
```

