# Interaction Component

The **Interaction Component** provides a modular and network-safe way for actors to interact with objects in the world that implement the `UInteractInterface`. It determines the best interactable actor nearby, handles authority checks, and triggers interactions both locally and on the server.

---

## Overview

The component supports:

* **Automatic detection** of nearby interactable actors
* **Authority validation** and **server RPC forwarding**
* **Customizable colliders** for interaction range detection
* **Blueprint extendable logic** via `GetBestInteractable`

This makes it ideal for use in player characters, AI, or world objects that need to perform interactions dynamically.

---

## Core Interaction Logic

```cpp
void UInteractionComponentBase::InteractWithBest()
{
	if (!GetOwner()->HasAuthority())
	{
		Server_InteractWithBest();
		return;
	}
	
	Interact(GetBestInteractable());
}
```

### How it works:

1. **Authority Check:**

   * If called on a client, it forwards the request to the server with `Server_InteractWithBest()`.
   * If authority is already held (e.g., on the server), it continues execution immediately.

2. **Interaction Execution:**

   * Calls `GetBestInteractable()` to find the optimal target.
   * Invokes `Interact()` with that target.

---

## Setting Up the Collider

The component uses a **shape collider** to detect potential interactable objects.
You can dynamically assign it at runtime or configure it via Blueprint.

```cpp
void UInteractionComponentBase::SetInteractionCollider(UShapeComponent* Collider)
{
	InteractionCollider = Collider;
}
```

This collider is typically a **sphere** or **capsule component** attached to your character or pawn, representing the interaction range.

---

## Finding the Best Interactable

The component determines the closest valid interactable by scanning overlapping actors.

```cpp
UObject* UInteractionComponentBase::GetBestInteractable_Implementation() const
{
	UE_LOG(LogTemp, Warning, TEXT("GetBestInteractable"));
	UObject* BestInteractable = nullptr;
	float BestDistance = 0.0f;
	TArray<AActor*> OverlappingActors;
	InteractionCollider->GetOverlappingActors(OverlappingActors);

	for (int i = 0; i < OverlappingActors.Num(); i++)
	{
		UObject* Interactable = OverlappingActors[i];
		if (IsValid(Interactable) && Interactable->Implements<UInteractInterface>())
		{
			float Distance = FVector::DistSquared(OverlappingActors[i]->GetActorLocation(), GetOwner()->GetActorLocation());
			if (BestInteractable == nullptr || Distance < BestDistance)
			{
				BestInteractable = Interactable;
				BestDistance = Distance;
			}
		}
	}

	return BestInteractable;
}
```

### Key Details:

* Uses `GetOverlappingActors()` from the assigned collider to find nearby actors.
* Checks if each actor **implements `UInteractInterface`**.
* Calculates the **closest valid interactable** based on distance.
* Returns the best candidate for interaction.

---

## Example Blueprint Setup

1. Add a **Sphere Collision** component to your character.
2. Add the **Interaction Component** and call `SetInteractionCollider()` on BeginPlay.
3. Bind your **Interact input** to call `InteractWithBest()`.
4. Ensure your interactable objects implement `UInteractInterface`.

---
