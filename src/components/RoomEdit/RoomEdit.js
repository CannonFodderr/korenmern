import React, {Component} from 'react';
import {Button, Segment, List, Icon} from 'semantic-ui-react';
import {serverAPI} from '../../api/api';
import adminContext from '../../contexts/adminContext';

let INITIAL_STATE = {
    allUsers: null,
    allBooks: null,
    currentUser: null,
    currentBook: null,
    currentPart: null
}

class RoomEdit extends Component{
    state = INITIAL_STATE;
    renderCurrentRoomData = () => {
        let listArr = []
        for(let key in this.context.selectedRoom){
            listArr.push(key);
        };
        return listArr.map((key, index) => {
            return <List.Item key={key}>{key}: {this.context.selectedRoom[key]}</List.Item>
        });
    }
    renderUserSelection = () => {
        if(!this.context.users){
            return <option>Loading Users...</option>
        } else {
            let currentUserId = "";
            let optionContent = "";
            if(this.context.selectedRoom && this.context.selectedRoom.currentUser){
                let currentUser = this.context.selectedRoom.currentUser;
                currentUserId = currentUser._id;
                optionContent = `${currentUser.firstName} ${currentUser.lastName}`;
            }
            return (
                <select onChange={(e) => { 
                    this.setState({ currentUser: e.target.selectedOptions[0].id})}}
                >
                <option id={currentUserId}>{optionContent}</option>
                {this.renderUserList()}       
                </select>
            )
        }
    }
    renderUserList = () => {
        return this.context.users.map((user) => {
            return <option id={user._id} key={user._id}>{user.firstName} {user.lastName}</option>
        })
    }
    renderBookSelection = () => {
        let books = this.context.books
        if(!books || books.length < 1 ){
            return <option>Loading Books Data...</option>
        } else {
            let currentBookId = "";
            let optionContent = "";
            if(this.context.selectedRoom && this.context.selectedRoom.currentBook){
                let currentBook = this.context.selectedRoom.currentBook;
                currentBookId = currentBook._id;
                optionContent = `${currentBook.name}`;
            }
            return (
                <select onChange={(e) => { 
                    this.setState({currentBook: e.target.selectedOptions[0].id})}}>
                    <option id={currentBookId}>{optionContent}</option>
                    {this.renderBookList()}
                </select>
            )
        }
    }
    renderBookList = () => {
        return this.context.books.map((book) => {
            return <option id={book._id} key={book._id}>{book.name}</option>
        })
    }
    renderBookParts = () => {
        if(!this.state.currentBook){
            return;
        } else {
        let currentPart = ""
        if(this.context.selectedRoom && this.context.selectedRoom.currentPart){
            currentPart = this.context.selectedRoom.currentPart;
        }
        return(
            <select onChange={(e) => { 
                this.setState({currentPart: e.target.selectedOptions[0].id})}}>
                <option id={currentPart}>{currentPart}</option>
                {this.renderPartsList()}
            </select>
            )
        }
    }
    renderPartsList = () => {
        let books = this.context.books;
        if(books && books.length > 0){
            let selectedBook = books.filter(book => book._id === this.state.currentBook);
            return selectedBook[0].parts.map((part, index) => {
                return <option key={index} id={part}>{part}</option>
            })
        }
    }
    renderButtons = () =>{
        if(this.state.currentUser && this.state.currentBook && this.state.currentPart){
            return(
                <div>
                    <Button negative onClick={() => this.clearCurrentRoomData()}>Clear</Button>
                    <Button primary onClick={() => this.updateCurrentRoomData()}>Update</Button>
                </div>
            )
        } else {
            return <Button negative onClick={() => this.clearCurrentRoomData()}>Clear</Button>
        }
    }
    updateCurrentRoomData = () => {
        let data = {
            currentUser: this.state.currentUser,
            currentBook: this.state.currentBook,
            currentPart: this.state.currentPart
        }
        serverAPI.put(`/rooms/${this.context.selectedRoom._id}`, data)
        .then(() => {
            this.context.getAllRooms();
            this.props.handleModalClose();
        })
        .catch(err => console.log(err));
    }
    clearCurrentRoomData = async () => {
        await this.setState({
            currentUser: null,
            currentBook: null,
            currentPart: null
        })
        this.updateCurrentRoomData();
    }
    setCurrentState = () => {
        let selectedRoom = this.context.selectedRoom;
        if(!selectedRoom){
            return;
        } else{
            let currentUser = selectedRoom.currentUser ? selectedRoom.currentUser._id : null;
            let currentBook = selectedRoom.currentBook ? selectedRoom.currentBook._id : null;
            let currentPart = selectedRoom.currentPart ? selectedRoom.currentPart : null;
            this.setState({currentUser, currentBook, currentPart});
        }
    }
    componentDidMount(){
        this.context.fetchUsersList();
        this.context.fetchBooksList();
        this.setCurrentState();
    }
    render(){
        return(
            <Segment inverted>
                <h4>Select User</h4>
                {this.renderUserSelection()}
                <h4>Select Book</h4>
                {this.renderBookSelection()}
                <h4>Select File</h4>
                {this.renderBookParts()}
                <hr />
                {this.renderButtons()}
            </Segment>
        )
    }
}

RoomEdit.contextType = adminContext;
export default RoomEdit;
