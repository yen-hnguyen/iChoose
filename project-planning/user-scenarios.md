# iChoose - User Scenarios 

## *Tips*
* A user scenario is a syntactic alternative to user stories
* They have the form: Given _____, when ______, then ______.
* eg. Given that I am logged in, when I click favourite on a post, then it is added to my favourites.
* You can also chain on an and to user stories/scenarios
* eg. Given that I am logged in, when I click favourite on a post, then it is added to my favourites and the save icon will change to indicate success.

------

**creator** - creates the poll //
**user** - the voter & creator

* As a creator, I'm logged in, when I click "Create a New Poll", it will go to the page where I can enter an email, the question and choices
* When a poll is finished being created, I will be given two links: an administrative link (which lets me access the results) and a submission link (which the user sends to their friends)
* As a creator, I'm logged in, when I click "View my polls", I can see the list my current and previous polls with their results. I have an option to delete the poll as well
* As a user, I will be able to rank my choices from 1 - n and submit my vote
* As a user, I will be able to access to poll & results via links
* The option that has the most points, wins
* If there is a tie, we will use Math.random() to choose one option