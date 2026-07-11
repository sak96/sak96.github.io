+++
title = "Weird S3 List Permission"
date = 2021-06-20
[taxonomies]
tags = ["aws", "story", "security"]
categories = ["stories"]
+++

S3's file storage system employs a flat namespace architecture, where all objects are stored as key-value pairs without hierarchical folders.
While most interfaces simulate folder hierarchies using `/` as a path delimiter, this abstraction can introduce security risks when designing access policies for list operations.

<!--more-->

## List Operation Behavior in Flat Namespaces

In traditional folder hierarchies, listing a directory reveals child files and subdirectories.
S3's flat structure requires a different interpretation:

- **Files** begin with a prefix *and* do not contain a `/`
- **Directories** begin with a prefix *and* end with a `/`

This mapping ensures expected behavior when using prefix-based listing (e.g., `s3:prefix` conditions in IAM policies).

## Critical Security Vulnerability in Policy Design

When implementing secure home directory storage in S3 (where user home paths follow `home/${username}`), the following policy is initially used:

```json
{
  "Effect": "Allow",
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::bucket-name",
  "Condition": {
    "StringLike": {
      "s3:prefix": ["", "home/", "home/${aws:username}/*"]
    }
  }
}
```

This policy permits listing contents *under* a user's home directory.
However, it fails to address two critical scenarios:

1. **Missing trailing `/`**:
   Users may omit the trailing slash (e.g., `home/${username}`), enabling recursive listing of *other* users' directories
1. **Substring conflicts**:
   If usernames are non-unique (e.g., `user` and `user_with_user_prefix`), listing one user's directory may inadvertently expose another's contents

**Vulnerability Example**

When `user` lists their home directory without a trailing `/`, the S3 list operation may unexpectedly reveal:
`home/user_with_user_prefix/...`
This occurs because S3's flat namespace treats `user_with_user_prefix` as a valid prefix starting with the substring `user`.

## Mitigation Strategy

To prevent cross-user leakage, the policy must explicitly support both prefix patterns:

```json
{
  "Effect": "Allow",
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::bucket-name",
  "Condition": {
    "StringLike": {
      "s3:prefix": ["home/${aws:username}", "home/${aws:username}/*"]
    }
  }
}
```

This solution requires **string sanitization of usernames** to avoid substring conflicts.

## Key Takeaways

1. **Never rush security implementations** – Prefix-based listing policies require thorough validation
1. **Prioritize flat namespace awareness** over hierarchical abstractions when designing S3 access policies
1. **Sanitize user identifiers** to prevent substring-based access leakage (e.g., ensure usernames do not share prefixes)
1. **Validate edge cases** through concrete examples before deploying policies

This approach aligns with AWS best practices while addressing the unique challenges of S3's flat file model.

# Resource

-
