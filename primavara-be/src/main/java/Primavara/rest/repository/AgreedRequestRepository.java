package Primavara.rest.repository;

import Primavara.rest.domain.AgreedRequest;
import Primavara.rest.domain.AppUser;
import Primavara.rest.dto.RequestBothDTO;
import Primavara.rest.dto.RequestDogDTO;
import Primavara.rest.dto.RequestGuardianDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AgreedRequestRepository extends JpaRepository<AgreedRequest, Long> {

    Long countByAgreedRequestId(Long id);

    AgreedRequest findByAgreedRequestId(Long id);

    @Query(value = "SELECT request_guardian_id, initiator_user_id FROM agreed_request WHERE user_id = 11 and is_agreed IS NULL and request_guardian_id IS NOT NULL", nativeQuery = true)
    List<?> findAllMyRequestGuardiansOffers(@Param("i") Long id);

    @Query(value = "SELECT new Primavara.rest.dto.RequestGuardianDTO(a, rg) FROM AgreedRequest AS ar JOIN AppUser  AS a " +
            "on ar.initiatorUser.userId = a.userId JOIN RequestGuardian AS rg ON rg.requestGuardianId = ar.requestGuardian.requestGuardianId " +
            "where ar.appUser.userId = :i and ar.isAgreed is null and ar.requestGuardian.requestGuardianId is not null and ar.requestDog.requestDogId is null")
    List<RequestGuardianDTO> findAllMyOffers(@Param("i") Long id);

    @Query(value = "SELECT new Primavara.rest.dto.RequestDogDTO(a, rd) FROM AgreedRequest AS ar JOIN AppUser  AS a " +
            "on ar.initiatorUser.userId = a.userId JOIN RequestDog AS rd ON rd.requestDogId = ar.requestDog.requestDogId " +
            "where ar.appUser.userId = :i and ar.isAgreed is null and ar.requestGuardian.requestGuardianId is null and ar.requestDog.requestDogId is not null")
    List<RequestDogDTO> findAllMyOffers2(@Param("i") Long id);

    @Query(value = "SELECT new Primavara.rest.dto.RequestBothDTO(rd, rg) FROM AgreedRequest AS ar JOIN RequestGuardian AS rg " +
            "on ar.requestGuardian.requestGuardianId = rg.requestGuardianId JOIN RequestDog AS rd ON rd.requestDogId = ar.requestDog.requestDogId " +
            "where ar.appUser.userId = :i and ar.isAgreed is null and ar.requestGuardian.requestGuardianId is not null and ar.requestDog.requestDogId is not null")
    List<RequestBothDTO> findAllMyOffers3(@Param("i") Long id);

    @Query(value = "SELECT agreed_request_id FROM agreed_request_id where initiator_user_id = :i and user_id = :j and request_guardian_id = :k", nativeQuery = true)
    Long respondToGuardian(@Param("i") Long idInitiator, @Param("j") Long idUser, @Param("k") Long idReqGua);

    @Query(value = "SELECT agreed_request_id FROM agreed_request_id where initiator_user_id = :i and user_id = :j and request_dog_id = :k", nativeQuery = true)
    Long respondToDog(@Param("i") Long idInitiator, @Param("j") Long idUser, @Param("k") Long idReqDog);
}
