import Clipboard from "clipboard"

const pre = document.getElementsByTagName("pre")

for (let i = 0; i < pre.length; ++i) {
    const element = pre[i]
    const mermaid = element.getElementsByClassName("language-mermaid")[0]

    if (mermaid == null) {
        element.insertAdjacentHTML("afterbegin", "<button class=\"btn btn-copy\" data-copy-state=\"Copy\"></button>")
    }
}

const clipboard = new Clipboard(".btn-copy", {
    target: function (trigger) {
        return trigger.nextElementSibling
    },
})

clipboard.on("success", function (e) {
    e.trigger.setAttribute("data-copy-state", "Copied")

    setTimeout(function () {
        e.trigger.setAttribute("data-copy-state", "Copy")
    }, 700)

    e.clearSelection()
})

clipboard.on("error", function (e) {
    console.error("Action:", e.action)
    console.error("Trigger:", e.trigger)
})
