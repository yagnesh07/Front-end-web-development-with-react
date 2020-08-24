import React, { Component } from 'react';
import { Card, CardImg, CardTitle, CardBody, CardText, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

 class CommentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit=(values)=>{
        this.toggleModal();
        this.props.postComment(
            this.props.dishId,
            values.rating,
            values.author,
            values.comment
        ) 
       /* console.log('current state is: ' + JSON.stringify(values));
        alert('Current state is: ' + JSON.stringify(values)); */
    }
    render(){
        return (
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span className = "fa fa-pencil"/> Submit Comment
                </Button>
                <Modal isOpen = {this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle = {this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit = {(values) => this.handleSubmit(values)}>
                            <Row className = "form-group">
                                <Label htmlFor="rating" md={12}>
                                    Rating
                                </Label>
                                <Col md={{ size:12 }}>
                                    <Control.select
                                        model= ".rating"
                                        name= "rating"
                                        className= "form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className = "form-group">
                                <Label htmlFor="author" md={12}>
                                    Your Name
                                </Label>
                                <Col md={12}>
                                    <Control.text model = ".author" id="author" name = "author" 
                                    placeholder="Your Name" className = "form-control"
                                    validators={{
                                        minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                     />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            
                            <Row className = "form-group">
                                <Label htmlFor="comment" md={12}>
                                    Comment
                                </Label>
                                <Col md = {12}>
                                    <Control.textarea 
                                    model=".comment"
                                    id="comment"
                                    name="comment"
                                    rows={5}
                                    className="form-control"
                                    validators={{
                                        required
                                    }}/>
                                     <Errors
                                        className="text-danger"
                                        model=".comment"
                                        show="touched"
                                        messages={{
                                            required:'Comment Required'
                                        }}
                                     />
                                </Col> 
                            </Row>
                            <Button type = "submit" value = "submit" color = "primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
 }
   
   function RenderDish({dish}){
      return(
          <FadeTransform in transformProps = {{
            exitTransform: 'scale(0.5) translateY(-50%)'
          }}>
            <Card>
                <CardImg top src = {baseUrl + dish.image} alt = {dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
          </FadeTransform>
      );
   }

   function RenderComments({comments, postComment, dishId}){
       if (comments == null || comments.lenght === 0){
           return (
              <div></div>
           );
       }
       
            const renderedComments = comments.map((comment) => {    
                return(   
                <Stagger in>  
                    <Fade in>        
                            <li key = {comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                            </li>   
                    </Fade>            
                </Stagger>            
                );               
            });

       return(
          <div>
              <h4>Comments</h4>
              <ul className = "list-unstyled">
                  {renderedComments}
              </ul>
              <CommentForm dishId={dishId} postComment={postComment}/>
          </div>
       );
   } 

    const DishDetail = (props) => {
        if(props.isLoading) {
            return(
                <div className = "container">
                    <div className = "row">
                        <Loading/>
                    </div>
                </div>
            );
        }
        else if(props.errMess) {
            return(
                <div className = "container">
                    <div className = "row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish != null){
            return(
            <div className = "container">
                <div className = "row">
                 <Breadcrumb>
                   <BreadcrumbItem><Link to = '/menu'>Menu</Link></BreadcrumbItem>
                   <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className = "col-12">
                    <h3>{props.dish.name}</h3>
                    <hr/>
                </div>
             </div>
                <div className = "row">
                   <div className = "col-12 col-md-5 m-1">
                       <RenderDish dish = {props.dish} />
                   </div>
                   <div className = "col-12 col-md-5 m-1">
                       <RenderComments comments = {props.comments}
                       postComment = {props.postComment}
                       dishId = {props.dish.id} />
                   </div>
                </div>
            </div>
            );
        }
        else{
          return(
              <div></div>
          );
        }
    }

export default DishDetail;