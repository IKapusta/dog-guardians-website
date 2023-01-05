package Primavara.rest.service;

import Primavara.rest.domain.AppUser;
import Primavara.rest.domain.Breed;
import Primavara.rest.domain.RequestDog;
import Primavara.rest.dto.NewRequestDog;
import Primavara.rest.repository.AppUserRepository;
import Primavara.rest.repository.BreedRepository;
import Primavara.rest.repository.RequestDogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class RequestDogServiceImpl implements RequestDogService{
    @Autowired
    private RequestDogRepository requestDogRepository;

    @Autowired
    private BreedRepository breedRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Override
    public List<Optional<RequestDog>> getAllReviewedAndPublishedRequestDogs() {
        return requestDogRepository.findAllReviewedAndPublishedAndNotGone();
    }

    @Override
    public List<Optional<RequestDog>> getAllReviewedAndPublishedRequestDogsAndMine(Long id) {
        return requestDogRepository.findAllReviewedAndPublishedAndNotGoneAndMine(id);
    }

    @Override
    public List<Optional<RequestDog>> getAllReviewedAndPublishedRequestDogsAndNotInitiatedByMe(Long id) {
        return requestDogRepository.findAllReviewedAndPublishedAndNotGoneAndNotInitiatedByMe(id);
    }

    @Override
    public void addNewRequestDog(NewRequestDog newRequestDog, Long id){
        validate(newRequestDog);

        if (appUserRepository.findByUserId(id) == null){
            throw new RequestDeniedException(
                    "AppUser with id " + id + " does not exists"
            );
        }

        //(iz tog cemo iscitati hasExperience i hasDog atribute)
            AppUser appUser=appUserRepository.findByUserId(id);
        //
        if (appUser.getRole().getRoleId() == 1)
            throw new RequestDeniedException(
                    "Owner can not add new RequestDog"
            );

        RequestDog requestDog = new RequestDog();
        requestDog.setDogAge(newRequestDog.getDogAge());
        if (java.time.LocalDate.now().isAfter(newRequestDog.getDogTimeBegin().toLocalDateTime().toLocalDate()))
            throw new RequestDeniedException(
                    "Date of beginning must be in the future"
            );
        requestDog.setDogTimeBegin(newRequestDog.getDogTimeBegin());
        if (java.time.LocalDate.now().isAfter(newRequestDog.getDogTimeEnd().toLocalDateTime().toLocalDate()))
            throw new RequestDeniedException(
                    "Date of ending must be in the future"
            );
        requestDog.setDogTimeEnd(newRequestDog.getDogTimeEnd());
        if (newRequestDog.getDogTimeBegin().toLocalDateTime().toLocalDate().isAfter(newRequestDog.getDogTimeEnd().toLocalDateTime().toLocalDate()))
            throw new RequestDeniedException(
                    "Date of beginning must be before date of ending"
            );
        requestDog.setFlexible(newRequestDog.getFlexible());
        requestDog.setLocation(newRequestDog.getLocation());
        requestDog.setLocationName(newRequestDog.getLocationName());
        requestDog.setNumberOfDogs(newRequestDog.getNumberOfDogs());

        requestDog.setPublished(false);
        requestDog.setReviewed(false);

        Breed dogBreed=breedRepository.findByBreedId(newRequestDog.getBreedId());
        requestDog.setBreed(dogBreed);

        requestDog.setAppUser(appUser);

        requestDogRepository.save(requestDog);
    }

    private void validate(NewRequestDog newRequestDog) {
        Assert.notNull(newRequestDog, "NewRequestDog object must be given");
        Assert.hasText(newRequestDog.getDogAge().toString(), "NewRequestDog dogAge must be given");
        Assert.notNull(newRequestDog.getDogTimeBegin(), "NewRequestDog dogTimeBegin must be given");
        Assert.notNull(newRequestDog.getDogTimeEnd(), "NewRequestDog dogTimeBEnd must be given");
        Assert.notNull(newRequestDog.getFlexible(), "NewRequestDog isFlexible must be given");
        Assert.hasText(newRequestDog.getLocation(), "NewRequestDog location must be given");
        Assert.hasText(newRequestDog.getLocationName(), "NewRequestDog locationName must be given");
        Assert.hasText(newRequestDog.getNumberOfDogs().toString(), "NewRequestDog numberOfDogs must be given");
        if (breedRepository.countByBreedId(newRequestDog.getBreedId()) == 0)
            throw new RequestDeniedException(
                    "Breed with id " + newRequestDog.getBreedId() + " does not exist"
            );
    }

    @Override
    public List<Optional<RequestDog>> getAllRequestDogsByUserId(Long id){
        AppUser appUser=appUserRepository.findByUserId(id);
        if(appUser.getRole().getRoleId()==1){
            throw new RequestDeniedException(
                    "User with role " + appUser.getRole().getName() + " cannot access RequestDogs"
            );
        }

        return requestDogRepository.findAllByUserId(id);
    }
}
