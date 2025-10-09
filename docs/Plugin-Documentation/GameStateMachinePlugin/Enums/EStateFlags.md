
---

# EStateFlags Documentation

## Overview

`EStateFlags` is a **bitmask enumeration** used to track and manage the lifecycle of a `UStateObject` within a `UGameStateManagerComponent` or a `UMasterStateObject`.

It provides flags to indicate:

* Whether a state is **queued for entry**.
* Whether a state is **queued for exit**.
* Whether a state is currently **active**.
* Whether a state is **paused**.

Using these flags helps ensure safe and predictable **state transitions**, preventing accidental re-entry or premature exit of states.

---

## Enum Values

| Name         | Value    | Description                                                                                                           |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| None         | `0`      | No flags set. Hidden in editor.                                                                                       |
| MarkForEntry | `1 << 0` | Indicates the state is queued to become active. Should be cleared if the transition fails.                            |
| MarkForExit  | `1 << 1` | Indicates the state is queued to be deactivated. Should be cleared if the transition fails.                           |
| Active       | `1 << 2` | Indicates the state is currently active. Active states should not be re-entered or exited unless explicitly intended. |
| Paused       | `1 << 3` | Indicates the state is paused.                                                                                        |

---

## Usage Example

### Setting a Flag

```cpp
MyState->SetStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
```

### Checking a Flag

```cpp
if(MyState->HasStateFlag(static_cast<int32>(EStateFlags::Active)))
{
    UE_LOG(LogTemp, Display, TEXT("State is active"));
}
```

### Clearing a Flag

```cpp
MyState->ClearStateFlag(static_cast<int32>(EStateFlags::MarkForEntry));
```

---

## Behavior Summary

* `MarkForEntry`: Queues a state to become active. Prevents re-entry of already active states.
* `MarkForExit`: Queues a state to be deactivated. Ensures exit logic is only applied to active states.
* `Active`: Marks the state as currently in use. Transition logic checks this to avoid double-activation or double-exit.
* `Paused`: Temporarily suspends the state without fully deactivating it. Useful for temporary interruptions in state logic.

---

## Summary

This enum is **designed for internal state management**, enabling deterministic and safe transitions in complex state machines, such as **gameplay systems, AI state trees, day/night cycles, or experiment block sequences**.

