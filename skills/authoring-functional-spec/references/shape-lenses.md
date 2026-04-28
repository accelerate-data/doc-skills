# Shape Lenses

Use the selected shape as a section menu, not a checklist. Include only sections that fit the spec.

## Journey

Use for actor-led workflows with a beginning, progression, and terminal outcome.

Suggested sections: Trigger, Primary actor, Main flow or Phases, Alternate flows, Failure cases, State transitions, Business rules, Events / observability.

Keep sequence only where order matters behaviorally. Avoid UI layout, payload shape, and retry mechanics.

## Surface

Use for screens, panels, widgets, dashboards, and other user-facing surfaces.

Suggested sections: When-to-use, Surface inventory, Surface states, Interaction model, Cross-flow touch matrix, Access & responsiveness.

Describe what the surface lets the persona understand or do. Avoid layout, exact copy, component hierarchy, and microinteraction detail.

## Service

Use for backend services, modules, subsystems, and continuously available capabilities.

Suggested sections: Goals + Non-goals, Boundary contract, Lifecycle, Ownership, Consumers, Concurrency / ordering invariants, Risks & mitigations, Failure modes by class.

Describe externally meaningful behavior, guarantees, and outcomes. Avoid API schemas, class names, storage layouts, exact retry policy, and internal state machines unless the state is behaviorally visible.

## Skill

Use for agent skills, slash commands, and agent-facing workflow contracts.

Suggested sections: Invocation triggers, Phases, Refusal & scope rails, Handoffs, Runtime context contract, Resources used.

Describe when the agent should use the skill and what behavioral outcome it must produce. Avoid exact tool-call choreography and provider-specific mechanics unless they are part of the user-visible contract.

## Install

Use for installation, bootstrap, setup, and operator-run configuration procedures.

Suggested sections: Preconditions, Procedure, Verification, Rollback / recovery, Idempotency guarantees, Failure classes.

Describe what the operator must accomplish and what states the system can safely reach. Avoid shell-by-shell detail unless a command is the public product surface.

## Utility

Use for CLI tools, libraries, helpers, and separately shipped utilities.

Suggested sections: Public surface, Distribution kind, Audience class, Lifecycle, Exit conditions, Versioning & compatibility stance.

Describe supported behavior, compatibility promises, and terminal outcomes. Avoid internal module structure and private command plumbing.
