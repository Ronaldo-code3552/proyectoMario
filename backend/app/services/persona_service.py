from typing import Any, Optional

from app.repositories.persona_repository import PersonaRepository


class PersonaService:
    @staticmethod
    def get_all(
        page_number: int = 1,
        page_size: int = 20,
        search_term: Optional[str] = None,
    ) -> Any:
        return PersonaRepository.get_all_json(
            page_number=page_number,
            page_size=page_size,
            search_term=search_term,
        )

    @staticmethod
    def get_by_id(persona_id: int) -> Any:
        return PersonaRepository.get_by_id_json(persona_id)

    @staticmethod
    def create(payload: dict) -> Any:
        return PersonaRepository.insert_json(payload)

    @staticmethod
    def update(persona_id: int, payload: dict) -> Any:
        return PersonaRepository.update_json(persona_id, payload)

    @staticmethod
    def delete(persona_id: int, force: bool = False) -> Any:
        return PersonaRepository.delete_json(persona_id, force)