
# **Quick Setup Guide – Game State Management Plugin**

## **1. Add the Plugin to Your Project**

* Copy the plugin folder into your project's `Plugins` directory.
* Ensure it is **enabled** in `Edit → Plugins` in Unreal Engine.
* Restart the editor if necessary.

---

## **2. Create Your Root State Object**

* Right-click in the Content Browser → **Blueprint Class** → `URootStateObject` (or a subclass like `URootStateObject_Nested` or `URootStateObject_Tag`).
* Name it, e.g., `BP_GameStateRoot`.

---

## **3. Add Initial States**

* If using a nested root:

  * Set **Instanced Initial States** or define an **Initial State Class**.
* If using a tag-based root:

  * Assign **InitialStateTagQuery** to select the first state automatically.
  * Optionally, assign **tags** to states for querying later.

---

## **4. Add Game State Manager Component**

* Open your **GameMode** or any **Actor** that should manage global states.
* Add **UGameStateManagerComponent**.
* Assign your **Root State Object** to the component.

---

## **5. Initialize the System**

* The **GameStateManagerComponent** will automatically call `Init()` and enter the root state on `BeginPlay`.
* No further setup is required for basic operation.

---

## **6. Interacting with States**

* **Transition between states:**

```cpp
StateManager->AttemptStateTransition(TargetState);
```

* **Get the currently active state:**

```cpp
UStateObject* Active = StateManager->GetActiveStateObject();
```

* **Check flags:**

```cpp
if(Active->HasStateFlag(static_cast<int32>(EStateFlags::Active)))
{
    // Do something
}
```

---

## **7. Blueprint Usage**

* All key functions are **BlueprintCallable** or **BlueprintPure**:

  * `AttemptStateTransition`
  * `GetActiveStateObject`
  * `AddStateClassWithTags` / `AddStateWithTags`
  * `GetStatesByTagQuery` / `GetFirstStateByTagQuery`
* **Event delegates** are available to respond to transitions:

  * `OnStateTransition`
  * `OnStateTransitionEvent`
  * `PostInternalStateTransition` (for nested roots)
  * `OnTagStateAdded` (for tag roots)

---

## **8. Tips**

* Use **tags** to organize large numbers of states.
* Use **nested root objects** to model complex hierarchies.
* Combine **flags** and **events** for robust state validation and observable transitions.

