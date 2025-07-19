+++
title = "weird s3 list permission"
date = 2021-06-20
[taxonomies]
tags = ["story", "s3", "security"]
categories = ["stories"]
+++
<!-- cspell:ignore googlefu,duckduckgo -->

## S3 is flat

S3 is one of the file storage service available in the "Cloud".
The common way the file are stored is using folder hierarchies.
But S3 does not use hierarchies to store files.
Instead all files are stored in flat structure.
There are no folders, only key value pairs of path and content of file.

Most interface designs try to maintain consistency with folder hierarchies.
This is done by using `/` as delimiter for folder names.
This allows user to carry on his life, as if, he was using folder hierarchies.
But interestingly, forgetting that S3 is flat may not be entirely good.

## S3 List Operation

Listing file in normal folder hierarchy is trivial to imagine.
List all the file and folder children of given folder.

But in case of flat hierarchy it becomes interesting.
There are no folder to list, so what constitutes a list operation?
The ideal answer would be, to map to what would have happened it were folder hierarchy.

So List operation would show all files/folder starting with certain prefix.
Where files would start with the prefix and does not contain a '/'.
Where as folders would start with the prefix and end with a '/'.
This seems to match what we would have expected from folder hierarchy.

## S3 List Permission

Consider a case where you are storing home directories of user to s3.
You would want the user to only able to read,write and **list** his own home.
Also the home folder name is same as user name.

If you googlefu is strong enough you may end up [here][home_s3].
I prefer duckduckgo so, I typed `!aws IAM users S3 home` and picked the first result.
`!aws` searches for aws docs, this is bang search from duckduckgo, more [here][ddg_bang].

You might feel that computer security gods and smiling on you.
And yes, they are!
But not in the way you would hope, not for you happiness.
They are, in fact, laughing (not just smiling) at you as you walk into the pit.

This article is interested in list operation, So, let ignore all other operation.
Below is the json permission for managing list operation from [here][home_s3].

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

So the recommended way to restrict list operation is to use `s3:prefix` condition.
This means restriction is entirely based on prefixes.

Now let us analyze each prefix one by one.

| prefix                    | use                               |
| ------------------------- | --------------------------------- |
| ""                        | to list root directory            |
| "home/"                   | to list all directory in home     |
| "home/${aws:username}/\*" | list any thing is user's own home |

Note: `${aws:username}` is to map every user's home directory name to user name.

Now let go back to what exactly list does.
**List operation would show all files/folder starting with certain prefix**.
So everything is fine, correct ?
There should be no issue with this.

No, Interface just hides flat structure of the storage.
But we also have recursive listing in folder structure.
Imagine, What happens if you use the same here, but on **prefix** ?
In particular with **home/** or **""** ?

You should be able to see all file beginning with "home/" or "".
This means you should also be able to see "home/some_other_user/..." in the list.
This is exactly what happens, meaning you can see all files in other's home directory.
This may not be a issue as they cannot still read or write the files.

## My Story with List Permission

The above issue was something I had already in my mind when I was framing the policy.
We decided to go with following list permission in the policy.

```json
{
  "Effect": "Allow",
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::bucket-name",
  "Condition": {
    "StringLike": {
      "s3:prefix": ["home/${aws:username}/*"]
    }
  }
}
```

When the policy was used and there were issue, Some of list operation failed.
Many user were using `home/${aws:username}`, without trailing `/`.
This means a lot changes had to be done to comply with this policy.
So we decided to allow the path without trailing `/`.

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

Seems ok, there should be no issues, right?
It did seem to work well, when we tested again.
All scripts worked as expected.
But, it had a serious security draw back.

Just imagine if you had two user `user` and `user_with_user_prefix`.
And now what happens if `user` list for his home without `/`.
And yeah user can do it recursively.
This list `user_with_user_prefix`'s home contents as well.

Note, This might not be problem if you have constant length strings for username.
For example in this [aws docs][home_again_s3], similar policy is shown.
By my understanding, these `${cognito-identity.amazonaws.com:sub}` are all same length.
Which means there cannot be sub-string of one another.
In other words, sanitize user input, even user names.

## Conclusion

1. Never hurry, especially a security related activity. It's ok to be slow.
1. Some times, Concentrate concepts may be better then abstract interface.
1. Repeat, Thinking in terms of flat structure `>` folder hierarchy interface.
1. Sanitize user input may be a good idea.
1. Use [bang][ddg_bang] to search faster.

[home_s3]: https://web.archive.org/web/20201112042023/https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_home-directory-console.html
[home_again_s3]: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_cognito-bucket.html
[ddg_bang]: https://duckduckgo.com/bang

