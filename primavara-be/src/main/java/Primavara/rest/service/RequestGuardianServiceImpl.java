package Primavara.rest.service;

import Primavara.rest.domain.*;
import Primavara.rest.dto.NewRequestDog;
import Primavara.rest.dto.NewRequestGuardian;
import Primavara.rest.repository.AppUserRepository;
import Primavara.rest.repository.DogRepository;
import Primavara.rest.repository.RequestGuardianRepository;
import Primavara.rest.repository.RequestGuardiansDogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class RequestGuardianServiceImpl implements RequestGuardianService {
    @Autowired
    private RequestGuardianRepository requestGuardianRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private DogRepository dogRepository;

    @Autowired
    private RequestGuardiansDogRepository requestGuardiansDogRepository;
    @Override
    public List<Optional<RequestGuardian>> getAllReviewedAndPublishedRequestGuardians() {
        return requestGuardianRepository.findAllReviewedAndPublished();
    }

    @Override
    public void addNewRequestGuardian(NewRequestGuardian newRequestGuardian, Long id){
        validate(newRequestGuardian);
        Long counter=0L;
        if (appUserRepository.findByUserId(id) == null)
            throw new RequestDeniedException(
                    "AppUser with id " + id + " does not exists"
            );

        AppUser appUser=appUserRepository.findByUserId(id);

        if (appUser.getRole().getRoleId() == 2)
            throw new RequestDeniedException(
                    "Guardian can not add new RequestGuardian"
            );

        for(Long dogId: newRequestGuardian.getDogId()){
            if(!dogRepository.findUserIdByDogId(dogId).equals(id)){
                throw new RequestDeniedException(
                        "Dog with id " + dogId + " is not owned by user with id " + id
                );
            }
            counter++;
        }

        if(!counter.equals(newRequestGuardian.getNumberOfDogs())){
            throw new RequestDeniedException(
                    "Specified " + newRequestGuardian.getNumberOfDogs() + " dogs, but provided " +
                            counter + " dogs"
            );
        }

        RequestGuardian requestGuardian=new RequestGuardian();
        requestGuardian.setLocation(newRequestGuardian.getLocation());
        requestGuardian.setNumberOfDogs(newRequestGuardian.getNumberOfDogs());
        requestGuardian.setGuardTimeBegin(newRequestGuardian.getGuardTimeBegin());
        requestGuardian.setGuardTimeEnd(newRequestGuardian.getGuardTimeEnd());
        requestGuardian.setHasExperience(newRequestGuardian.getHasExperience());
        requestGuardian.setHasDog(newRequestGuardian.getHasDog());
        //za sada zbog testiranja (inace ce po defaultu ce biti false)
            requestGuardian.setPublished(true);
            requestGuardian.setReviewed(true);
        //
        requestGuardian.setAppUser(appUser);

        requestGuardianRepository.save(requestGuardian);

        for(Long dogId: newRequestGuardian.getDogId()){
            RequestGuardiansDog requestGuardiansDog = new RequestGuardiansDog();
            requestGuardiansDog.setRequestGuardian(requestGuardian);
            Dog dog=dogRepository.findByDogId(dogId);
            requestGuardiansDog.setDog(dog);
            requestGuardiansDogRepository.save(requestGuardiansDog);
        }
    }

    //validacija
    private void validate(NewRequestGuardian newRequestGuardian) {
        Assert.notNull(newRequestGuardian, "NewRequestGuardian object must be given");
        Assert.hasText(newRequestGuardian.getLocation(), "NewRequestGuardian location must be given");
        Assert.hasText(newRequestGuardian.getNumberOfDogs().toString(), "NewRequestGuardian numberOfDogs must be given");
        Assert.notNull(newRequestGuardian.getGuardTimeBegin(), "NewRequestGuardian guardTimeBegin must be given");
        Assert.notNull(newRequestGuardian.getGuardTimeEnd(), "NewRequestGuardian guardTimeBEnd must be given");
        Assert.notNull(newRequestGuardian.getHasExperience(), "NewRequestGuardian hasExperience must be given");
        Assert.notNull(newRequestGuardian.getHasDog(), "NewRequestGuardian hasDog must be given");

        for(Long dogId: newRequestGuardian.getDogId()){
            if(dogRepository.findByDogId(dogId)==null){
                throw new RequestDeniedException(
                        "Dog with id " + dogId + " does not exist"
                );
            }
        }
    }
}
