## Quick Start Guide for `local-pack`

`local-pack` is a CLI tool that simplifies packaging and installing local dependencies in your project.

### Installation

You can install `local-pack` either globally or locally in your project:

1. **Global Installation** (recommended for system-wide use):

   ```bash
   npm install -g local-pack
   ```

   This allows you to use the `localpack` command in any project.

2. **Local Installation** (specific to a single project):

   ```bash
   npm install local-pack --save-dev
   ```

   Then, run the command with `npx`:

   ```bash
   npx localpack /path/to/consuming-project
   ```

### Usage

Once installed, you can use the `localpack` command to package and install a local dependency in another project.

```bash
localpack /path/to/consuming-project
```

### Commands

- **Install and Package Local Dependency**:

  ```bash
  localpack /path/to/consuming-project
  ```

  This command will:

  - Update the package version in `local-pack`.
  - Build and create a `.tgz` package file.
  - Update the dependency in the target project to use the local `.tgz` file.
  - Install the updated dependency in the target project.

- **Clean Up Changes**:

  ```bash
  localpack /path/to/consuming-project --clean
  ```

  This command will:

  - Revert the version change in `local-pack`.
  - Remove `.tgz` files generated during packaging.
  - Restore the original dependency version in the target project.

### Examples

1. **Package and Install**:

   ```bash
   localpack /Users/username/my-consuming-app
   ```

2. **Clean Up Changes**:
   ```bash
   localpack /Users/username/my-consuming-app --clean
   ```

And that’s it! `local-pack` is ready to help you manage your local dependencies effortlessly.
