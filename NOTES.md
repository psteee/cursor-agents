##Shortcut per salvare e committare tutto su GitHub.

```json
{
    "key": "ctrl+cmd+s",
    "command": "runCommands",
    "args": {
        "commands": [
            { "command": "git.stageAll" },
            { "command": "cursor.generateGitCommitMessage" },
            { "command": "git.commitAll" },
            { "command": "git.sync" }                
        ]
    }
}
```