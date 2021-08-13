# hiera-eyaml-gpg

This extension adds support for running encrypt/decrypt commands within yaml files using hiera-eyaml-gpg package. The hiera-eyaml-gpg gem is required to be installed.

## Features
- Select string right click decrypt
- Select string right click encrypt
### Encryption

- Allows for encrypting the currently selected data using the public key specified in your settings.
- Accessible via command palette or editor context menu as: *Encrypt selection with eyaml*
- Public key needs to be installed into the users gpg keyring

### Decryption

- Allows for decrypting the currently selected data using the public and private keys specified in your settings.
- Accessible via command palette or editor context menu as: *Decrypt selection with eyaml*
- Private gpg key needs to be installed in the local users keyring.

## Requirements
Ruby and the hiera-eyaml-gpg gem are required to be installed. The hiera-eyaml-gpg gem can be installed using this command: `gem install hiera-eyaml-gpg`

## Extension Settings

This extension contributes the following settings under `hiera-eyaml`:
* `eyamlPath`: Path to the eyaml command line utility.
* `publicKeyPath`: Recipients list of emails (Seporated by commas)
