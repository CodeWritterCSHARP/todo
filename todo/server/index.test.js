import { expect } from "chai"

before(async () => {
    await fetch("http://localhost:3001/test/cleanup", { method: "POST" })
})

describe("Testing user management", () => {

    const user = { email: "foo2@test.com", password: "password123" }
    before(() => {
        insertTestUser(user)
    })

     it ('should log in', async () => {
        const response = await fetch("http://localhost:3001/user/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user })
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["id", "email", "token"])
        expect(data.email).to.equal(user.email)
     })


     it("should sign up", async () => {
        const newUser = { email: "foo@test.com" ,password: "password123" }
        const response = await fetch("http://localhost:3001/user/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: newUser })
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(["id", "email"])
        expect(data.email).to.equal(newUser.email)
    })
})

describe("Testing basic database functionality", () => {

    it("should get all tasks", async () => {
        const response = await fetch("http://localhost:3001/")
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array").that.is.not.empty
        expect(data[0]).to.include.all.keys(["id", "description"])
    })

    it("should create a new task", async () => {
        const newTask = { description: "Test task" }
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: newTask })
        })

        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(["id", "description"])
        expect(data.description).to.equal(newTask.description)
    })

it("should delete task", async () => {
        const createRes = await fetch("http://localhost:3001/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: { description: "Temp task to delete" } })
        })
        const created = await createRes.json()

        const response = await fetch(`http://localhost:3001/delete/${created.id}`, {
            method: "DELETE"
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys("id")
    })

    it("should not create a new task without description", async () => {
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: null})
        })
        
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.include.all.keys("error")
    })
})
