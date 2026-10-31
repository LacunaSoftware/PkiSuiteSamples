# PKI Suite Samples

Runnable web apps that show how to call Lacuna Software's PKI Suite products from several languages.

## Language

**Project**:
One runnable app for one language and framework, such as `java/springmvc`. Most projects are web apps that contain many samples; a console project may contain a single sample.
_Avoid_: App, sample (for the whole app), solution

**Sample**:
One catalog entry: a single task done with a single product inside one project.
_Avoid_: Example, demo, project (for one entry)

**Task**:
What the end user accomplishes, independent of product and language, such as PAdES signature or certificate authentication.
_Avoid_: Feature, use case, operation

**Product**:
The Lacuna PKI Suite offering a sample calls to do its task, such as PKI SDK or Rest PKI Core.
_Avoid_: Library, API, engine (for the offering as a whole)

**Slug**:
The identifier of a task done with a product, written `<task>-<product>` and identical in every language.
_Avoid_: Sample id, key, name

**Demo Site**:
Lacuna's public site where visitors try PKI Suite tasks live, at try.lacunasoftware.com.
_Avoid_: Demo (for the whole site), try site

**Demo**:
One page on the Demo Site that does one task, made with one or more products (such as Web PKI in the browser with PKI SDK on the server). A sample matches a demo only when its task is the same and its product is one the demo is made with.
_Avoid_: Sample, example

**Participant**:
A person with a part to play in a Signer document's flow, identified by CPF, by email, or both.
_Avoid_: Signer (for the person; Signer is the product), user, signatory

**Pending Document**:
A Signer document that a given participant can sign with a certificate right now. A document awaiting the participant's approval, or one where the participant's turn has not come yet, is not pending for them.
_Avoid_: Open document, document to sign
