import React, { useState } from "react";

//negative value means i owe friend
//positive value means friend owes me
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [selectedFriend, setSelectedFriend] = useState(null); //could be name or userID
  const [pnlOpen, setPnlOpen] = useState(true);
  const [friends, setFriends] = useState(initialFriends);

  if (selectedFriend === null) {
    console.log("selectedFriend is null");
  } else {
    console.log("selectedFriend.id: " + selectedFriend.id);
  }
  //console.log(friends);

  function handleSelect(friend) {
    console.log("selecting friend");
    console.log(friend);
    //console.log("friendId selected: " + friend.id);
    setSelectedFriend(friend);
  }

  function handleToggleOpen(isOpen) {
    setPnlOpen(!isOpen);
  }

  function handleBillSplit(e, friendId, value) {
    e.preventDefault(); //stop form submission

    //console.log("friendId: " + friendId + ", value: " + value);

    //update friend list friend to have new balance
    setFriends((friends) =>
      friends.map((friend) => {
        if (friend.id === friendId) {
          //console.log("updating friend " + friend.id);
          return { ...friend, balance: friend.balance + value };
        } else {
          //console.log("skipping friend " + friend.id);
          return friend;
        }
      }),
    );
  }

  function handleAddFriend(friend) {
    //console.log("adding friend");
    //console.log(friend);
    setFriends((origFriends) => [...origFriends, friend]);
    console.log("friendId added: " + friend.id);
    //console.log(friends);

    handleToggleOpen(pnlOpen);
  }

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <h1>Eat-n-Split</h1>
          <FriendList
            friends={friends}
            onSelect={handleSelect}
            selectedFriendId={selectedFriend ? selectedFriend.id : 0}
          ></FriendList>
          {/* either button OR form will show */}
          {/* button text will change to Close when panel is open */}
          {pnlOpen && (
            <FormAddFriend onAddFriend={handleAddFriend}></FormAddFriend>
          )}
          <Button onClickHandler={(e) => handleToggleOpen(pnlOpen)}>
            {pnlOpen ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend !== null && (
          <FormSplitBill
            friend={selectedFriend}
            onBillSplit={handleBillSplit}
            key={selectedFriend.id}
          />
        )}
      </div>
    </>
  );
}

function FriendList({ friends, onSelect, selectedFriendId }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selected={selectedFriendId === friend.id}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selected }) {
  //const { name, image, balance, id } = friend;

  function handleFriendToggle() {
    if (selected) {
      //if they were already selected, cancel selection
      onSelect(null);
    } else {
      //else if friend was not selected, select them
      onSelect(friend);
    }
  }

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          I owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes me ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button
        onClickHandler={() => {
          handleFriendToggle();
        }}
      >
        {selected ? "Cancel" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("");
  const newId = Math.floor(Math.random() * 10000);
  //const newId = crypto.randomUUID(); //renders a guid

  function createFriend(e) {
    e.preventDefault(); //don't submit the form!

    //gaurd clause
    if (!friendName | !friendImage) return;

    //console.log("creating friend to add");
    const newFriend = {
      id: newId,
      name: friendName,
      image: "https://i.pravatar.cc/48?u=" + newId,
      balance: 0,
    };

    setFriendName("");
    setFriendImage("");

    //console.log(newFriend);
    onAddFriend(newFriend);
  }

  //form could have an onSubmit handler instead of the submit button having an onClick handler
  //either way will work
  return (
    <>
      <form className="form-add-friend">
        <label>Friend Name: </label>
        <input
          type="text"
          placeholder="name"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        ></input>
        <label>Image URL: </label>
        <input
          type="text"
          placeholder="image"
          value={friendImage}
          onChange={(e) => setFriendImage(e.target.value)}
        ></input>
        <p>
          <Button onClickHandler={(e) => createFriend(e)}>Add</Button>
        </p>
      </form>
    </>
  );
}

function FormSplitBill({ friend, onBillSplit }) {
  const [billValue, setBillValue] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [payer, setPayer] = useState("user");

  const friendExpense = billValue - myExpense;

  function handleMyExpenseChange(n) {
    //guard clause
    if (!billValue) return;

    setMyExpense(n);
  }

  return (
    <div>
      <form className="form-split-bill">
        <h2>split a bill with {friend === null ? "a friend" : friend.name}</h2>
        <label>Bill value</label>
        <input
          type="text"
          value={billValue}
          onChange={(e) => setBillValue(Number(e.target.value))}
        ></input>
        <label>Your expense</label>
        <input
          type="text"
          value={myExpense}
          onChange={(e) => handleMyExpenseChange(Number(e.target.value))}
        ></input>
        <label>{friend === null ? "Friend" : friend.name}'s expense</label>
        <input type="text" disabled value={friendExpense}></input>
        <label>Who's paying?</label>
        <select value={payer} onChange={(e) => setPayer(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">
            {friend === null ? "friend" : friend.name}
          </option>
        </select>
        {
          friend !== null && (
            <Button
              onClickHandler={(e) =>
                onBillSplit(
                  e,
                  friend.id,
                  payer === "user" ? friendExpense : -myExpense,
                )
              }
            >
              Split Bill
            </Button>
          )

          //   if (payer === "user") {
          //     console.log(`friend ${friend.id} owes me ${friendExpense}`);
          //   } else {
          //     console.log(`I owe friend ${friend.id} ${myExpense}`);
          //   }
        }
      </form>
    </div>
  );
}

function Button({ onClickHandler, children }) {
  return (
    <button className="button" onClick={onClickHandler}>
      {children}
    </button>
  );
}
